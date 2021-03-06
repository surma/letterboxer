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

import { h } from "./dom-jsx.js";
import { nextEvent } from "./dom-utils.js";

export async function blobToDrawable(blob) {
  if ("createImageBitmap" in self) {
    const imgurl = URL.createObjectURL(blob);
    const buffer = await fetch(imgurl).then(r => r.blob());
    URL.revokeObjectURL(imgurl);
    return await createImageBitmap(buffer);
  } else {
    const imgurl = URL.createObjectURL(blob);
    const img = <img src={imgurl} />;
    if ("decode" in img) {
      await img.decode();
    } else {
      await nextEvent(img, "load");
    }
    return img;
  }
}

export function drawableToImageData(drawable, { scale = 100 } = {}) {
  let canvas;
  const width = Math.floor((drawable.width * scale) / 100);
  const height = Math.floor((drawable.height * scale) / 100);
  if ("OffscreenCanvas" in self) {
    canvas = new OffscreenCanvas(width, height);
  } else {
    canvas = <canvas width={width} height={height} />;
  }
  const ctx = canvas.getContext("2d");
  ctx.drawImage(drawable, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

export function imageDataToCanvas(imageData, canvas) {
  if (!canvas) {
    canvas = <canvas />;
  }
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function canvasToBlob(canvas, type, opts) {
  return new Promise(resolve => {
    canvas.toBlob(resolve, type, opts);
  });
}
