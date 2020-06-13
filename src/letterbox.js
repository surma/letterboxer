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
  const imageStartX = (targetWidth - image.width) / 2;
  const imageStartY = (targetHeight - image.height) / 2;
  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.putImageData(image, imageStartX, imageStartY);

  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}
