import { modulePromise } from "asc:./letterbox.as";

export async function letterbox(image, aspectW, aspectH, r, g, b, a) {
  const sourceRatio = image.width / image.height;
  const targetRatio = aspectW / aspectH;
  let targetWidth, targetHeight;
  if (targetRatio >= sourceRatio) {
    targetHeight = image.height;
    targetWidth = Math.round(image.height * targetRatio);
  } else {
    targetWidth = image.width;
    targetHeight = Math.round(image.width / targetRatio);
  }
  const targetImageSize = targetWidth * targetHeight * 4;
  const bufferSize = targetImageSize;
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

  const data = new Uint8ClampedArray(memory.buffer, 0, targetImageSize);
  // Need to slice the data here to work around a bug in Chrome.
  // https://crbug.com/1056661
  return new ImageData(data.slice(), targetWidth, targetHeight);
}
