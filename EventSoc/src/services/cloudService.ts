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
    .then((res) => {
      if (res) {
        return getDownloadURL(res.ref);
      }
      throw "Error: Unable to upload image";
    })
    .catch((err) => console.log(err));
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
    .catch((err) => console.log(err));
}
