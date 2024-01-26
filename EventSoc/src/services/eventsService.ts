import {
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  getDoc
} from "firebase/firestore";
import { eventPicturesRef, eventsCol } from "../config/firebaseConfig";
import { EventData, Event } from "../../../Models/Event";
import { updateImage } from "./cloudService";

export function retrieveEventData(id: string) {
  return getDoc(doc(eventsCol, id))
    .then((eventSnapshot) => {
      if (!eventSnapshot.exists()) {
        throw Error;
      }
      return {
        ...eventSnapshot.data(),
        startDate: eventSnapshot.data().startDate.toDate(),
        endDate: eventSnapshot.data().endDate.toDate()
      } as EventData;
    })
    .catch(() => {
      throw Error("Could not retrieve event. Try again later.");
    });
}

export function retrieveEvents() {
  return getDocs(query(eventsCol, orderBy("startDate")))
    .then((eventsSnapshot) =>
      eventsSnapshot.docs.map((doc) => {
        const event = {
          ...doc.data(),
          startDate: doc.data().startDate.toDate(),
          endDate: doc.data().endDate.toDate()
        } as EventData;
        return <Event>{ id: doc.id, data: event };
      })
    )
    .catch(() => {
      throw Error("Could not retrieve all events. Try again later.");
    });
}

export function updateEvent(updates: Partial<EventData>, eventId: string) {
  const eventDoc = doc(eventsCol, eventId);

  const updatedCapacityErrMsg =
    "Updated capacity must not be smaller than number of sign-ups.";

  const updatedCapacityCheck =
    updates.capacity !== undefined
      ? retrieveEventData(eventId).then((event) => {
          const newCapacity = updates.capacity ?? 0; // updates.capacity should always be defined at this point
          if (newCapacity >= 0 && newCapacity < event.attendeeIds.length) {
            throw Error(updatedCapacityErrMsg);
          }
        })
      : Promise.resolve();

  const getFullUpdates =
    updates.pictureUrl === undefined
      ? Promise.resolve(updates)
      : updateImage(eventPicturesRef, eventId, updates.pictureUrl).then(
          (downloadUrl) => {
            return { ...updates, pictureUrl: downloadUrl };
          }
        );

  return updatedCapacityCheck
    .then(() => getFullUpdates)
    .then((fullUpdates) => updateDoc(eventDoc, fullUpdates))
    .catch((err) => {
      throw err.message === updatedCapacityErrMsg
        ? err
        : Error("Unable to update event. Try again later.");
    });
}
