import {
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { societiesCol, societyPicturesRef } from "../config/firebaseConfig";
import { Society, SocietyData } from "../models/Society";
import { updateImage, uploadImage } from "./cloudService";

export function retrieveSocietyData(soc: string) {
  const socDoc = doc(societiesCol, soc);
  return getDoc(socDoc)
    .then((socSnapshot) => <SocietyData>socSnapshot.data())
    .catch(() => {
      throw Error("Society couldn't be retrieved. Try again later.");
    });
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
    .catch(() => {
      throw Error("Could not retrieve all societies. Try again later.");
    });
}

export function createSociety(society: SocietyData) {
  const socRef = doc(societiesCol);

  const uploadResult = society.pictureUrl
    ? uploadImage(societyPicturesRef, society.pictureUrl, socRef.id)
    : Promise.resolve("");

  return societyNameTaken(society.name)
    .catch((err) => {
      throw err;
    })
    .then((isSocNameTaken) => {
      if (isSocNameTaken) {
        throw Error("Society name taken");
      }
      return uploadResult
        .then((downloadUrl) => {
          setDoc(socRef, { ...society, pictureUrl: downloadUrl });
          return socRef.id;
        })
        .catch(() => {
          throw Error("Couldn't create society. Try again later.");
        });
    });
}

export function updateSociety(
  updates: Partial<SocietyData>,
  societyId: string
) {
  const societyDoc = doc(societiesCol, societyId);

  const getFullUpdates =
    updates.pictureUrl === undefined
      ? Promise.resolve(updates)
      : updateImage(societyPicturesRef, societyId, updates.pictureUrl).then(
          (downloadUrl) => {
            return { ...updates, pictureUrl: downloadUrl };
          }
        );

  return getFullUpdates
    .then((fullUpdates) => updateDoc(societyDoc, fullUpdates))
    .catch(() => {
      throw Error("Unable to update society. Try again later.");
    });
}

function societyNameTaken(name: string) {
  return getCountFromServer(query(societiesCol, where("name", "==", name)))
    .then((result) => Boolean(result.data().count))
    .catch(() => {
      throw Error("Something went wrong. Try again later.");
    });
}
