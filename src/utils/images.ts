import imageCompression, { Options } from "browser-image-compression";


export async function compressImage(
    imageFile: File,
    options: Options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
  ) {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  }
  