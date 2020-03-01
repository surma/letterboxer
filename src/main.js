/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  fromEvent,
  map,
  forEach,
  subscribe,
  filter,
  discard
} from "observables-with-streams";

import {
  hasWorkerizedCreateImageBitmap,
  drawableToImageData as workerizedDrawableToImageData,
  blobToDrawable as workerizedBlobToDrawable,
  letterbox,
  hasWorkerizedOffscreenCanvas
} from "./worker-singleton.js";
import {
  blobToDrawable,
  drawableToImageData,
  canvasToBlob,
  imageDataToCanvas
} from "./image-utils.js";
import { colorFromInput, downloadBlob, idle } from "./dom-utils.js";
import { h, Fragment, render } from "./dom-jsx.js";
import { gateOn } from "./ows-utils.js";

async function blobToImageData(blob) {
  let bitmap;
  if (await hasWorkerizedCreateImageBitmap()) {
    bitmap = await workerizedBlobToDrawable(blob);
  } else {
    bitmap = await blobToDrawable(blob);
  }
  let imageData;
  if (await hasWorkerizedOffscreenCanvas()) {
    imageData = await workerizedDrawableToImageData(bitmap);
  } else {
    imageData = drawableToImageData(bitmap);
  }
  return imageData;
}

export async function main() {
  const output = document.querySelector("#output");
  const dropZoneView = output.querySelector("#dropzone");
  const configureViewPromise = import("./views/configure.js");
  let chain = fromEvent(dropZoneView.querySelector("input"), "change")
    .pipeThrough(filter(ev => ev.target.files && ev.target.files.length >= 1))
    .pipeThrough(map(ev => ev.target.files[0]))
    .pipeThrough(
      forEach(async file => {
        const { view, image } = await configureViewPromise;
        const url = URL.createObjectURL(file);
        image.src = url;
        render(output, view);
      })
    );

  const spinnerViewPromise = import("./views/spinner.js");
  const resultViewPromise = import("./views/result.js");
  const { submit, width, height, color } = await configureViewPromise;
  chain = chain
    .pipeThrough(gateOn(fromEvent(submit, "click")))
    .pipeThrough(
      forEach(async () => {
        const { view } = await spinnerViewPromise;
        render(output, view);
      })
    )
    .pipeThrough(
      map(async file => {
        const image = await blobToImageData(file);
        const letterboxedImage = await letterbox(
          image,
          parseInt(width.value),
          parseInt(height.value),
          ...colorFromInput(color),
          255
        );
        return letterboxedImage;
      })
    )
    .pipeThrough(
      forEach(async imageData => {
        const { view, canvas } = await resultViewPromise;
        imageDataToCanvas(imageData, canvas);
        render(output, view);
      })
    )
    .pipeTo(discard());

  {
    const { back } = await configureViewPromise;
    fromEvent(back, "click").pipeTo(
      subscribe(() => {
        render(output, dropZoneView);
      })
    );
  }
  {
    const { back } = await resultViewPromise;
    fromEvent(back, "click").pipeTo(
      subscribe(() => {
        render(output, dropZoneView);
      })
    );
  }

  idle().then(() => import("./sw-installer.js"));
}
