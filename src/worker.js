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

import "./worker-fix.js";

import { expose } from "comlink";

import wasmUrl from "asc:./letterbox.as";
import { compile } from "./wasm-utils.js";

const modulePromise = compile(fetch(wasmUrl));
async function letterbox(image, aspectW, aspectH, r, g, b, a) {
  const sourceRatio = image.width / image.height;
  const targetRatio = aspectW / aspectH;
  let targetWidth, targetHeight;
  if (targetRatio >= sourceRatio) {
    targetHeight = image.height;
    targetWidth = image.height * targetRatio;
  } else {
    targetWidth = image.width;
    targetHeight = image.width / targetRatio;
  }
  const targetImageSize = targetWidth * targetHeight * 4;
  const bufferSize = image.data.byteLength + targetImageSize;
  const numPages = Math.ceil(bufferSize / (64 * 1024));
  const memory = new WebAssembly.Memory({ initial: numPages });
  const instance = await WebAssembly.instantiate(await modulePromise, {
    env: { memory }
  });
  new Uint8ClampedArray(memory.buffer, 0, image.data.byteLength).set(
    image.data
  );
  instance.exports.letterbox(
    image.width,
    image.height,
    targetWidth,
    targetHeight,
    r,
    g,
    b,
    a
  );

  const data = new Uint8ClampedArray(
    memory.buffer,
    image.data.byteLength,
    targetImageSize
  );
  // Need to slice the data here to work around a bug in Chrome.
  // https://crbug.com/1056661
  return new ImageData(data.slice(), targetWidth, targetHeight);
}

expose({
  letterbox
});
