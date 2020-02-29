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
import { colorFromInput, downloadBlob } from "./dom-utils.js";
import { h, Fragment, render } from "./dom-jsx.js";

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

const output = document.querySelector("#output");
const form = document.querySelector("#form");
form.onsubmit = async ev => {
  ev.preventDefault();
  const imageBlob = form.file.files[0];
  const image = await blobToImageData(imageBlob);
  const letterboxedImage = await letterbox(
    image,
    parseInt(form.width.value),
    parseInt(form.height.value),
    ...colorFromInput(form.color),
    255
  );
  const canvas = imageDataToCanvas(letterboxedImage);
  render(
    output,
    <>
      {canvas}
      <button
        onclick={async () => {
          const blob = await canvasToBlob(canvas, "image/jpeg", 100);
          const file = new File([blob], "image.jpeg", { type: "image/jpeg" });
          downloadBlob(file);
        }}
      >
        JPEG
      </button>
      <button
        onclick={async () => {
          const blob = await canvasToBlob(canvas, "image/png");
          const file = new File([blob], "image.png", { type: "image/png" });
          downloadBlob(file);
        }}
      >
        PNG
      </button>
    </>,
    { append: false }
  );
};

navigator.serviceWorker.register("./sw.js");
