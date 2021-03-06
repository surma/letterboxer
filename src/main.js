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
  discard,
  merge
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
  imageDataToCanvas
} from "./image-utils.js";
import { colorFromInput, idle } from "./dom-utils.js";
import { h, Fragment, render } from "./dom-jsx.js";
import { gateOn, fromAsyncInitFunction } from "./ows-utils.js";
import "file-drop-element";
import {
  view as dropZoneView,
  input as dropInput,
  drop,
  reset as dropZoneReset
} from "./views/drop-zone.js";

async function blobToImageData(blob, opts) {
  let bitmap;
  if (await hasWorkerizedCreateImageBitmap()) {
    bitmap = await workerizedBlobToDrawable(blob, opts);
  } else {
    bitmap = await blobToDrawable(blob, opts);
  }
  let imageData;
  if (await hasWorkerizedOffscreenCanvas()) {
    imageData = await workerizedDrawableToImageData(bitmap, opts);
  } else {
    imageData = drawableToImageData(bitmap, opts);
  }
  return imageData;
}

function input() {
  return merge(
    fromEvent(dropInput, "change")
      .pipeThrough(filter(ev => ev.target.files && ev.target.files.length >= 1))
      .pipeThrough(map(ev => ev.target.files[0])),
    fromAsyncInitFunction(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return null;
      const mostActiveSW = reg.active || reg.waiting || reg.installing;
      mostActiveSW.postMessage("READY");
      return fromEvent(navigator.serviceWorker, "message").pipeThrough(
        map(ev => ev.data.file)
      );
    }),
    fromEvent(drop, "filedrop").pipeThrough(map(ev => ev.files[0]))
  );
}

async function main() {
  const output = document.querySelector("#output");
  const configureViewPromise = import("./views/configure.js");
  let chain = input().pipeThrough(
    forEach(async file => {
      const { width, height, view, image, reset } = await configureViewPromise;
      reset();
      const bitmap = await createImageBitmap(file);
      const url = URL.createObjectURL(file);
      image.src = url;
      render(output, view);
    })
  );

  const spinnerViewPromise = import("./views/spinner.js");
  const resultViewPromise = import("./views/result.js");
  const {
    submit,
    border,
    width,
    height,
    color,
    scale
  } = await configureViewPromise;
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
        const image = await blobToImageData(file, { scale: scale.value });
        const letterboxedImage = await letterbox(
          image,
          parseInt(width.value),
          parseInt(height.value),
          parseFloat(border.value),
          ...colorFromInput(color),
          255
        );
        return letterboxedImage;
      })
    )
    .pipeThrough(
      forEach(async imageData => {
        const { view, setResult } = await resultViewPromise;
        const canvas = imageDataToCanvas(imageData);
        render(output, view);
        setResult(canvas);
      })
    )
    .pipeTo(discard());

  {
    const { back } = await configureViewPromise;
    fromEvent(back, "click").pipeTo(
      subscribe(() => {
        dropZoneReset();
        render(output, dropZoneView);
      })
    );
  }
  {
    const { back } = await resultViewPromise;
    fromEvent(back, "click").pipeTo(
      subscribe(() => {
        dropZoneReset();
        render(output, dropZoneView);
      })
    );
  }
}

main();
idle().then(() => import("./sw-installer.js"));
