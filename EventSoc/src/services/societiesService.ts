import { doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { societiesCol, societyPicturesRef } from "../config/firebaseConfig";
import { Society, SocietyData } from "../models/Society";
import { updateImage, uploadImage } from "./cloudService";

export function retrieveSocietyData(soc: string) {
  const socDoc = doc(societiesCol, soc);
  return getDoc(socDoc)
    .then((socSnapshot) => <SocietyData>socSnapshot.data())
    .catch(() => Error("Society couldn't be retrieved. Try again later."));
}

export function retrieveSocieties() {
  return getDocs(societiesCol)
    .then((societiesSnapshot) => {
      const unorderedSocs = societiesSnapshot.docs.map(
        (doc) => <Society>{ id: doc.id, data: doc.data() }
      );
      return unorderedSocs.sort((a, b) =>
        a.data.name.localeCompare(b.data.name)
      );
    })
    .catch(() => Error("Could not retrieve all societies. Try again later."));
}

export function createSociety(society: SocietyData) {
  const socRef = doc(societiesCol);

  const uploadResult = society.pictureUrl
    ? uploadImage(societyPicturesRef, society.pictureUrl, socRef.id)
    : Promise.resolve("");

  return uploadResult
    .then((result) => {
      if (result instanceof Error) {
        return result;
      }
      setDoc(socRef, { ...society, pictureUrl: result });
    })
    .catch(() => Error("Couldn't create society. Try again later."));
}

export function updateSociety(
  updates: Partial<SocietyData>,
  societyId: string
) {
  const societyDoc = doc(societiesCol, societyId);

  return updateImage(societyPicturesRef, societyId, updates.pictureUrl)
    .then((url) => {
      if (url instanceof Error) {
        return url;
      }
      updateDoc(societyDoc, { ...updates, pictureUrl: url });
    })
    .catch(() => Error("Unable to update society. Try again later."));
}
