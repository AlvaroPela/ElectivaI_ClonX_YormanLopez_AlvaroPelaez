import { FirebaseApp } from "./config";

export type ProfileImageType = "avatar" | "cover";

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const uploadProfileImage = async (
  uid: string,
  type: ProfileImageType,
  file: File,
  onProgress: (progress: number) => void,
): Promise<string> => {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Usa una imagen JPG, PNG, WEBP o GIF.");
  }
  if (file.size > maxImageSize) {
    throw new Error("La imagen debe pesar 5 MB o menos.");
  }

  const storageApi = await import("firebase/storage");
  const storage = storageApi.getStorage(FirebaseApp);
  const imageRef = storageApi.ref(storage, `users/${uid}/${type}`);
  const uploadTask = storageApi.uploadBytesResumable(imageRef, file, {
    cacheControl: "no-cache",
    contentType: file.type,
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        onProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        );
      },
      reject,
      () => {
        storageApi.getDownloadURL(uploadTask.snapshot.ref).then(resolve, reject);
      },
    );
  });
};
