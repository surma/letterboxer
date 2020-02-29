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

function drawRect(
  x1: u32,
  y1: u32,
  x2: u32,
  y2: u32,
  stride: u32,
  color: u32
): void {
  if (x1 > x2) {
    // Swap
    x1 ^= x2;
    x2 ^= x1;
    x1 ^= x2;
  }
  if (y1 > y2) {
    // Swap
    y1 ^= y2;
    y2 ^= y1;
    y1 ^= y2;
  }
  let letterboxStride = (x2 - x1) * 4;
  let currentPixelAddress = y1 * stride + x1 * 4;
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      store<u32>(currentPixelAddress, color);
      currentPixelAddress += 4;
    }
    currentPixelAddress -= letterboxStride;
    currentPixelAddress += stride;
  }
}

export function letterbox(
  sourceWidth: u32,
  sourceHeight: u32,
  targetWidth: u32,
  targetHeight: u32,
  r: u8,
  g: u8,
  b: u8,
  a: u8
): void {
  let sourcesBytesPerRow = sourceWidth * 4;
  let targetBytesPerRow = targetWidth * 4;
  let sourceImageStart = 0;
  let sourceImageSize = sourcesBytesPerRow * sourceHeight;
  let sourceImageEnd = sourceImageStart + sourceImageSize;
  let outputImageStart = 0;
  let outputImageSize = targetBytesPerRow * targetHeight;
  let outputImageEnd = outputImageStart + outputImageSize;
  let letterboxColor =
    ((a as u32) << 24) | ((b as u32) << 16) | ((g as u32) << 8) | (r as u32);

  // Pixel coordinates of the first non-letterbox pixel within output image.
  let regionStartX = (targetWidth - sourceWidth) / 2;
  let regionStartY = (targetHeight - sourceHeight) / 2;
  // Bytes offset of that pixel.
  let regionStartOffset =
    outputImageStart + (regionStartY * targetWidth + regionStartX) * 4;

  // Start at the end of the source image.
  let sourceCurrentPixelAddress = sourceImageEnd - 4;
  // Start at the end of the image area within the output image.
  let regionCurrentPixelAddress =
    regionStartOffset +
    targetBytesPerRow * (sourceHeight - 1) +
    sourceWidth * 4 -
    4;

  // Move picture to the “center”.
  // We start at the last row, last pixel and work backwards
  // so we can move the image in-place.
  for (let y: u32 = 0; y < sourceHeight; y++) {
    for (let x: u32 = 0; x < sourceWidth; x++) {
      let pixel = load<u32>(sourceCurrentPixelAddress);
      store<u32>(regionCurrentPixelAddress, pixel);
      sourceCurrentPixelAddress -= 4;
      regionCurrentPixelAddress -= 4;
    }
    // Reset the output pointer to the last pixel of the current row,
    // then go one row up.
    regionCurrentPixelAddress += sourcesBytesPerRow;
    regionCurrentPixelAddress -= targetBytesPerRow;
  }

  let letterboxWidth =
    regionStartX === 0 ? targetWidth : (targetWidth - sourceWidth) / 2;
  let letterboxHeight =
    regionStartY === 0 ? targetHeight : (targetHeight - sourceHeight) / 2;
  // Fill in upper/left letterbox.
  drawRect(
    0,
    0,
    letterboxWidth,
    letterboxHeight,
    targetBytesPerRow,
    letterboxColor
  );
  // Fill in lower/right letterbox.
  drawRect(
    regionStartX === 0 ? 0 : letterboxWidth + sourceWidth,
    regionStartY === 0 ? 0 : letterboxHeight + sourceHeight,
    targetWidth,
    targetHeight,
    targetBytesPerRow,
    letterboxColor
  );
}
