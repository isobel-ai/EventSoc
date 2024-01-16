import { runTransaction, doc, getDoc, arrayUnion } from "firebase/firestore";
import { db, eventsCol, usersCol } from "../config/firebaseConfig";
import { EventData } from "../models/Event";

/**
 * @returns whether the sign-up is successful
 */
export function signUp(attendeeId: string, eventId: string) {
  return runTransaction(db, (transaction) => {
    const eventDoc = doc(eventsCol, eventId);
    const attendeeDoc = doc(usersCol, attendeeId);

    return getDoc(eventDoc).then((eventSnapshot) => {
      if (!eventSnapshot.exists()) {
        throw Error;
      }
      const event = {
        ...eventSnapshot.data(),
        startDate: eventSnapshot.data().startDate.toDate(),
        endDate: eventSnapshot.data().endDate.toDate()
      } as EventData;

      if (event.capacity === event.attendeeIds.length) {
        return false; // Event full
      }

      transaction
        .update(eventDoc, { attendeeIds: arrayUnion(attendeeId) })
        .update(attendeeDoc, { eventAttendingIds: arrayUnion(eventId) });
      return true;
    });
  }).catch(() => {
    throw Error("Unable to sign-up. Try again later.");
  });
}
