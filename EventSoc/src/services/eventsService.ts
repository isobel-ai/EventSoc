import { doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { eventPicturesRef, eventsCol } from "../config/firebaseConfig";
import {
  CreateSocEvent,
  RetrieveSocEvent,
  UpdateSocEvent
} from "../models/SocEvent";
import { deleteImage, uploadImage } from "./cloudService";

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

export function createEvent(createSocEvent: CreateSocEvent) {
  const eventRef = doc(eventsCol);

  const { localPictureUrl: localPictureURL, ...socEvent } = createSocEvent;

  if (localPictureURL) {
    return uploadImage(eventPicturesRef, localPictureURL, eventRef.id)
      .then((url) => setDoc(eventRef, { ...socEvent, pictureUrl: url }))
      .catch((err) => console.log(err));
  }

  return setDoc(eventRef, socEvent).catch((err) => console.log(err));
}

export function updateEvent(eventUpdates: UpdateSocEvent) {
  const { id, localPictureUrl, ...updates } = eventUpdates;
  const eventDoc = doc(eventsCol, id);

  if (localPictureUrl) {
    return uploadImage(eventPicturesRef, localPictureUrl, id).then((url) =>
      updateDoc(eventDoc, { ...updates, pictureUrl: url }).catch((err) =>
        console.log(err)
      )
    );
  }

  return updateDoc(eventDoc, updates).catch((err) => console.log(err));
}

export async function deleteEvent(id: string, pictureUrl: string) {
  const eventDoc = doc(eventsCol, id);
  if (pictureUrl) {
    await deleteImage(eventPicturesRef, id);
  }

  return deleteDoc(eventDoc).catch((err) => console.log(err));
}
