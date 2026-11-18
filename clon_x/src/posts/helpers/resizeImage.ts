const maxSide = 1080;
const maxInputSize = 10 * 1024 * 1024;
// Firestore documents can't be bigger than 1 MB, so the image stays well below that.
const maxDataUrlLength = 700_000;

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => reject(new Error("No se pudo leer la imagen."));
    image.src = url;
  });

const drawScaled = (image: HTMLImageElement) => {
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas;
};

// Makes the image smaller (max 1080 px, JPEG) and returns it as a data URL
// so it can be saved inside the post document without Firebase Storage.
export const resizeImage = async (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen.");
  if (file.size > maxInputSize) throw new Error("La imagen debe pesar 10 MB o menos.");

  const canvas = drawScaled(await loadImage(file));

  for (const quality of [0.8, 0.65, 0.5]) {
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length <= maxDataUrlLength) return dataUrl;
  }

  throw new Error("La imagen es demasiado pesada. Prueba con otra.");
};
