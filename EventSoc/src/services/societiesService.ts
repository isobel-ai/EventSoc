import {
  DocumentReference,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { societiesCol, societyPicturesRef } from "../config/firebaseConfig";
import {
  CreateSociety,
  RetrieveSociety,
  UpdateSociety
} from "../models/Society";
import { retrieveUser } from "./usersService";
import { updateImage, uploadImage } from "./cloudService";
import { sortByString } from "../helpers/SearchSortHelper";

/**
 * Retrieve society by Id or reference
 */
export function retrieveSociety(soc: string | DocumentReference) {
  const socDoc = typeof soc === "string" ? doc(societiesCol, soc) : soc;
  return getDoc(socDoc)
    .then((socSnapshot) => {
      return { ...socSnapshot.data(), id: socSnapshot.id } as RetrieveSociety;
    })
    .catch(() => Error("Society couldn't be retrieved. Try again later."));
}

export function retrieveSocieties() {
  return getDocs(societiesCol)
    .then((societiesSnapshot) => {
      const societyList = societiesSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as RetrieveSociety;
      });
      return societyList.sort((s1, s2) => sortByString(s1, s2, "name"));
    })
    .catch(() => Error("Could not retrieve all societies. Try again later."));
}

export function retrieveExecSocieties() {
  return retrieveUser().then((user) =>
    getDocs(query(societiesCol, where("exec", "array-contains", user.name)))
      .then((societiesSnapshot) => {
        const societyList = societiesSnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id } as RetrieveSociety;
        });
        return societyList.sort((s1, s2) => sortByString(s1, s2, "name"));
      })
      .catch(() => Error("Could not retrieve exec societies. Try again later."))
  );
}

export function createSociety(createSociety: CreateSociety) {
  const socRef = doc(societiesCol);

  const { localPictureUrl: localPictureURL, ...soc } = createSociety;

  if (localPictureURL) {
    return uploadImage(societyPicturesRef, localPictureURL, socRef.id)
      .then((result) => {
        if (result instanceof Error) {
          return result;
        }
        setDoc(socRef, { ...soc, pictureUrl: result });
      })
      .catch(() => Error("Couldn't create society. Try again later."));
  }

  return setDoc(socRef, soc).catch(() =>
    Error("Couldn't create society. Try again later.")
  );
}

export function updateSociety(socUpdates: UpdateSociety) {
  const { id, localPictureUrl, ...updates } = socUpdates;
  const socDoc = doc(societiesCol, id);

  let updateAttempt;
  if (localPictureUrl !== undefined) {
    updateAttempt = updateImage(societyPicturesRef, id, localPictureUrl).then(
      (url) => {
        if (url instanceof Error) {
          return url;
        }
        updateDoc(socDoc, { ...updates, pictureUrl: url });
      }
    );
  } else {
    updateAttempt = updateDoc(socDoc, updates);
  }

  return updateAttempt.catch(() =>
    Error("Unable to update society. Try again later.")
  );
}
