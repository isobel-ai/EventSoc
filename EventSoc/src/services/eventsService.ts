import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  getDoc
} from "firebase/firestore";
import { eventPicturesRef, eventsCol } from "../config/firebaseConfig";
import {
  CreateSocEvent,
  RetrieveSocEvent,
  UpdateSocEvent
} from "../models/SocEvent";
import { deleteImage, updateImage, uploadImage } from "./cloudService";

function retrieveEvent(eventRef: DocumentReference) {
  return getDoc(eventRef)
    .then((eventSnapshot) => {
      return {
        ...eventSnapshot.data(),
        startDate: eventSnapshot.data()?.startDate.toDate(),
        endDate: eventSnapshot.data()?.endDate.toDate(),
        id: eventSnapshot.id
      } as RetrieveSocEvent;
    })
    .catch((err) => console.log("Error: ", err));
}

export function retrieveEvents(
  eventRefs: DocumentReference[],
  setEvents: React.Dispatch<React.SetStateAction<RetrieveSocEvent[]>>
) {
  setEvents([]);

  const events: RetrieveSocEvent[] = [];
  eventRefs.forEach((ref) =>
    retrieveEvent(ref).then((event) => event && events.push(event))
  );
  setEvents(events);
}

export function createEvent(createSocEvent: CreateSocEvent) {
  const eventRef = doc(eventsCol);

  const { localPictureUrl: localPictureURL, ...socEvent } = createSocEvent;

  if (localPictureURL) {
    return uploadImage(eventPicturesRef, localPictureURL, eventRef.id)
      .then((url) => setDoc(eventRef, { ...socEvent, pictureUrl: url }))
      .then(() => eventRef)
      .catch((err) => console.log(err));
  }

  return setDoc(eventRef, socEvent)
    .then(() => eventRef)
    .catch((err) => console.log(err));
}

export function updateEvent(eventUpdates: UpdateSocEvent) {
  const { id, localPictureUrl, ...updates } = eventUpdates;
  const eventDoc = doc(eventsCol, id);

  if (localPictureUrl !== undefined) {
    return updateImage(eventPicturesRef, id, localPictureUrl)
      .then((url) => updateDoc(eventDoc, { ...updates, pictureUrl: url }))
      .catch((err) => console.log(err));
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
