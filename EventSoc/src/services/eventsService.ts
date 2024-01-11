import { doc, updateDoc, getDocs, query, orderBy } from "firebase/firestore";
import { eventPicturesRef, eventsCol } from "../config/firebaseConfig";
import { EventData, Event } from "../models/Event";
import { updateImage } from "./cloudService";

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

  return updateImage(eventPicturesRef, eventId, updates.pictureUrl)
    .then((downloadUrl) => {
      updateDoc(eventDoc, { ...updates, pictureUrl: downloadUrl });
    })
    .catch(() => {
      throw Error("Unable to update event. Try again later.");
    });
}
