export const degreesToRadians = (degree: number) => (degree * Math.PI) / 180;

export const loadImageAsync = (src: string) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img.src);
    };
  });

export const drawCanvasImage = ({
  isDrawingImage = true,
  img,
  ctx,
  SIZE,
  previewImageParams,
  previewImageSize,
  filterFunctions = {brightness: 1, contrast: 1},
}: {
  isDrawingImage?: boolean;
  ctx: CanvasRenderingContext2D | null;
  SIZE: number;
  img: HTMLImageElement;
  previewImageParams: Record<string, any>;
  previewImageSize: number;
  filterFunctions?: {brightness: number; contrast: number};
}) => {
  const {scale, rotate, ratioW, ratioH, translateX, translateY} = previewImageParams;
  if (ctx === null) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.closePath();

  ctx.filter = `brightness(${filterFunctions.brightness}) contrast(${filterFunctions.contrast})`;

  if (isDrawingImage === true) {
    ctx.translate(SIZE / 2, SIZE / 2);
    ctx.translate(
      (translateX * SIZE * 2) / previewImageSize,
      (translateY * SIZE * 2) / previewImageSize
    );
    ctx.scale(scale, scale);
    ctx.rotate(degreesToRadians(rotate));
    ctx.drawImage(
      img,
      (1 - ratioW) * 0.5 * SIZE - SIZE / 2,
      (1 - ratioH) * 0.5 * SIZE - SIZE / 2,
      ratioW * SIZE,
      ratioH * SIZE
    );
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};