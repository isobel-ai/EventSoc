import {
  DocumentReference,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import {
  eventsCol,
  societiesCol,
  societyPicturesRef
} from "../config/firebaseConfig";
import {
  CreateSociety,
  RetrieveSociety,
  UpdateSociety
} from "../models/Society";
import { retrieveUser } from "./usersService";
import { updateImage, uploadImage } from "./cloudService";
import { sortByString } from "../helpers/SearchSortHelper";

export function retrieveSociety(socId: string) {
  return getDoc(doc(societiesCol, socId))
    .then((socSnapshot) => {
      return { ...socSnapshot.data(), id: socSnapshot.id } as RetrieveSociety;
    })
    .catch((err) => console.log("Error: ", err));
}

export function retrieveSocieties(
  setSocieties: React.Dispatch<React.SetStateAction<RetrieveSociety[]>>
) {
  getDocs(societiesCol)
    .then((societiesSnapshot) => {
      const societyList = societiesSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as RetrieveSociety;
      });
      societyList.sort((s1, s2) => sortByString(s1, s2, "name"));
      setSocieties(societyList);
    })
    .catch((err) => console.log("Error: ", err));
}

export function retrieveExecSocieties(
  setExecSocieties: React.Dispatch<React.SetStateAction<RetrieveSociety[]>>
) {
  retrieveUser()
    .then((user) => user.name)
    .then((name) =>
      getDocs(query(societiesCol, where("exec", "array-contains", name)))
        .then((societiesSnapshot) => {
          const societyList = societiesSnapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as RetrieveSociety;
          });
          societyList.sort((s1, s2) => sortByString(s1, s2, "name"));
          setExecSocieties(societyList);
        })
        .catch((err) => console.log("Error: ", err))
    );
}

export function createSociety(createSociety: CreateSociety) {
  const socRef = doc(societiesCol);

  const { localPictureUrl: localPictureURL, ...soc } = createSociety;

  if (localPictureURL) {
    return uploadImage(societyPicturesRef, localPictureURL, socRef.id)
      .then((url) => setDoc(socRef, { ...soc, pictureUrl: url }))
      .catch((err) => console.log(err));
  }

  return setDoc(socRef, soc).catch((err) => console.log(err));
}

export function addSocEvent(socId: string, eventRef: DocumentReference) {
  updateDoc(doc(societiesCol, socId), {
    eventRefs: arrayUnion(eventRef)
  }).catch((err) => console.log(err));
}

export function deleteSocEvent(socId: string, eventId: string) {
  updateDoc(doc(societiesCol, socId), {
    eventRefs: arrayRemove(doc(eventsCol, eventId))
  }).catch((err) => console.log(err));
}

export function updateSociety(socUpdates: UpdateSociety) {
  const { id, localPictureUrl, ...updates } = socUpdates;
  const socDoc = doc(societiesCol, id);

  if (localPictureUrl !== undefined) {
    return updateImage(societyPicturesRef, id, localPictureUrl)
      .then((url) => updateDoc(socDoc, { ...updates, pictureUrl: url }))
      .catch((err) => console.log(err));
  }

  return updateDoc(socDoc, updates).catch((err) => console.log(err));
}
