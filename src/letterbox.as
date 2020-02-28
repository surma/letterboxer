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

export function letterbox(sourceWidth: u32, sourceHeight: u32, targetWidth: u32, targetHeight: u32, r: u8, g: u8, b: u8, a: u8): void {
  let sourceWidthX4    = sourceWidth * 4;
  let targetWidthX4    = targetWidth * 4;
  let outputImageStart = sourceWidthX4 * sourceHeight;
  let outputImageSize  = targetWidthX4 * targetHeight;
  let letterboxColor   = (a as u32) << 24 | (b as u32) << 16 | (g as u32) << 8 | (r as u32);

  // Fill canvas with background color
  // TODO: Could be smarter here and just full the letterboxes.
  for(let i: u32 = outputImageStart, len = outputImageStart + outputImageSize; i < len; i += 4) {
    store<u32>(i, letterboxColor);
  }

  let imageStartX = (targetWidth  - sourceWidth)  / 2;
  let imageStartY = (targetHeight - sourceHeight) / 2;
  let imageStepY  = (imageStartY * targetWidth + imageStartX) * 4;

  for(let y: u32 = 0; y < sourceHeight; y++) {
    let sourceStride = y * sourceWidthX4;
    let targetStride = outputImageStart + imageStepY + y * targetWidthX4;
    for(let x: u32 = 0; x < sourceWidth; x++) {
      let sourcePixelAddress = sourceStride + x * 4;
      let pixel = load<u32>(sourcePixelAddress);

      let targetPixelAddress = targetStride + x * 4;
      store<u32>(targetPixelAddress, pixel);
    }
  }
}