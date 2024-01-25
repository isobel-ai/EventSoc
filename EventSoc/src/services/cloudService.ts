import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";

export function uploadImage(
  storage: StorageReference,
  srcUrl: string,
  destUrl: string
) {
  const destRef = ref(storage, destUrl);
  return fetch(srcUrl)
    .then((res) => res.blob())
    .then((blob) => uploadBytes(destRef, blob))
    .then((res) => getDownloadURL(res.ref))
    .catch(() => {
      throw Error("Unable to upload image. Try again later.");
    });
}

/**
 * @param url if empty string, delete image. Otherwise upload image.
 */
export function updateImage(
  storage: StorageReference,
  id: string,
  url: string
) {
  if (url) {
    return uploadImage(storage, url, id);
  }
  return deleteImage(storage, id).then(() => "");
}

export function deleteImage(storage: StorageReference, id: string) {
  const picRef = ref(storage, id);
  return deleteObject(picRef).catch(() => {
    throw Error("Unable to delete image. Try again later.");
  });
}
