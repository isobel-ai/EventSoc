import { doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { eventPicturesRef, eventsCol } from "../config/firebaseConfig";
import {
  CreateSocEvent,
  RetrieveSocEvent,
  UpdateSocEvent
} from "../models/SocEvent";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject
} from "firebase/storage";

export function retrieveManagedEvents(
  setManagedEvents: React.Dispatch<React.SetStateAction<RetrieveSocEvent[]>>
) {
  getDocs(eventsCol)
    .then((eventsSnapshot) => {
      const eventList = eventsSnapshot.docs.map((doc) => {
        const socEvent = {
          ...doc.data(),
          startDate: doc.data().startDate.toDate(),
          endDate: doc.data().endDate.toDate()
        };
        return Object.assign(socEvent, {
          id: doc.id
        }) as RetrieveSocEvent;
      });
      setManagedEvents(eventList);
    })
    .catch((err) => console.log("Error: ", err));
}

function uploadEventImage(srcUrl: string, destUrl: string) {
  const destRef = ref(eventPicturesRef, destUrl);
  return fetch(srcUrl)
    .then((res) => res.blob())
    .then((blob) => uploadBytes(destRef, blob))
    .catch((err) => console.log(err));
}

export function createEvent(createSocEvent: CreateSocEvent) {
  const eventRef = doc(eventsCol);

  const { localPictureUrl: localPictureURL, ...socEvent } = createSocEvent;

  if (localPictureURL) {
    return uploadEventImage(localPictureURL, eventRef.id)
      .then((res) => {
        if (res) {
          return getDownloadURL(res.ref);
        }
        throw "Error: Unable to upload image";
      })
      .then((url) => setDoc(eventRef, { ...socEvent, pictureUrl: url }))
      .catch((err) => console.log(err));
  }

  return setDoc(eventRef, socEvent).catch((err) => console.log(err));
}

export function updateEvent(eventUpdates: UpdateSocEvent) {
  const { id, ...updates } = eventUpdates;
  const eventDoc = doc(eventsCol, id);
  return updateDoc(eventDoc, updates).catch((err) => console.log(err));
}

export function deleteEvent(id: string, pictureUrl: string) {
  const eventDoc = doc(eventsCol, id);
  if (pictureUrl) {
    const eventPicRef = ref(eventPicturesRef, id);
    return deleteObject(eventPicRef)
      .then(() => deleteDoc(eventDoc))
      .catch((err) => console.log(err));
  }

  return deleteDoc(eventDoc).catch((err) => console.log(err));
}
