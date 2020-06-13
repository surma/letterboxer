export async function letterbox(image, aspectW, aspectH, border, r, g, b, a) {
  image = await createImageBitmap(image);
  border = Math.floor((Math.min(image.width, image.height) * border) / 100);
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
  const imageStartX = (targetWidth - image.width) / 2 + border;
  const imageStartY = (targetHeight - image.height) / 2 + border;
  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(
    image,
    imageStartX,
    imageStartY,
    image.width - 2 * border,
    image.height - 2 * border
  );

  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}
