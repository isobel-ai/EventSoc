import { doc, updateDoc, DocumentReference, getDoc } from "firebase/firestore";
import { eventPicturesRef, eventsCol } from "../config/firebaseConfig";
import { RetrieveEvent, UpdateEvent } from "../models/Event";
import { updateImage } from "./cloudService";

function retrieveEvent(eventRef: DocumentReference) {
  return getDoc(eventRef)
    .then((eventSnapshot) => {
      if (!eventSnapshot.exists()) {
        throw Error;
      }
      return {
        ...eventSnapshot.data(),
        startDate: eventSnapshot.data().startDate.toDate(),
        endDate: eventSnapshot.data().endDate.toDate(),
        id: eventSnapshot.id
      } as RetrieveEvent;
    })
    .catch(() => Error("Event couldn't be retrieved. Try again later."));
}

export function retrieveEventOrganiserRef(eventRef: DocumentReference) {
  return getDoc(eventRef)
    .then((eventSnapshot) => {
      if (!eventSnapshot.exists()) {
        throw Error;
      }
      return eventSnapshot.data().organiserRef as DocumentReference;
    })
    .catch(() =>
      Error("Event organiser couldn't be retrieved. Try again later.")
    );
}

export function retrieveEvents(eventRefs: DocumentReference[]) {
  const eventPromises = eventRefs.map((ref) => retrieveEvent(ref));
  return Promise.all(eventPromises)
    .then((events) => {
      const resolvedEvents = events.filter(
        (event) => !(event instanceof Error)
      ) as RetrieveEvent[];
      if (resolvedEvents.length == 0 && eventPromises.length > 0) {
        console.log("yer");
        throw Error;
      }
      return resolvedEvents;
    })
    .then((events) =>
      events.sort((s1, s2) => s1.startDate.valueOf() - s2.startDate.valueOf())
    )
    .catch((err) => Error("Events couldn't be retrieved. Try again later."));
}

export function updateEvent(eventUpdates: UpdateEvent) {
  const { id, localPictureUrl, ...updates } = eventUpdates;
  const eventDoc = doc(eventsCol, id);

  let updateAttempt;
  if (localPictureUrl !== undefined) {
    updateAttempt = updateImage(eventPicturesRef, id, localPictureUrl).then(
      (url) => {
        if (url instanceof Error) {
          return url;
        }
        updateDoc(eventDoc, { ...updates, pictureUrl: url });
      }
    );
  } else {
    updateAttempt = updateDoc(eventDoc, updates);
  }

  return updateAttempt.catch(() =>
    Error("Unable to update event. Try again later.")
  );
}
