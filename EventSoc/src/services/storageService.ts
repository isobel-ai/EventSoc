import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";

export async function uploadImage(
  localUrl: string,
  folderRef: StorageReference,
  fileName: string
) {
  const destRef = ref(folderRef, fileName);
  await fetch(localUrl)
    .then((res) => res.blob())
    .then((blob) => uploadBytes(destRef, blob));
}

export function downloadImage(folderRef: StorageReference, fileName: string) {
  return getDownloadURL(ref(folderRef, fileName)).catch((err) => {
    if (err.code === "storage/object-not-found") {
      return "";
    }
    throw err;
  });
}

/**
 * @param newLocalUrl if empty string, delete image. Otherwise upload image.
 */
export async function updateImage(
  folderRef: StorageReference,
  fileName: string,
  newLocalUrl: string
) {
  await (newLocalUrl
    ? uploadImage(newLocalUrl, folderRef, fileName)
    : deleteImage(folderRef, fileName));
}

async function deleteImage(folderRef: StorageReference, fileName: string) {
  await deleteObject(ref(folderRef, fileName));
}
