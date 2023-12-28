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
    .catch(() => Error("Unable to upload image. Try again later."));
}

export function updateImage(
  storage: StorageReference,
  id: string,
  url: string
) {
  // If new image, upload. Otherwise delete old image.
  if (url) {
    return uploadImage(storage, url, id);
  }
  return deleteImage(storage, id);
}

export function deleteImage(storage: StorageReference, id: string) {
  const picRef = ref(storage, id);
  return deleteObject(picRef)
    .then(() => "")
    .catch((err) => Error("Unable to delete image. Try again later."));
}
