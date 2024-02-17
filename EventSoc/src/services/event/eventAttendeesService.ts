import {
  deleteDoc,
  doc,
  documentId,
  getCountFromServer,
  limit,
  query,
  runTransaction,
  where,
  writeBatch
} from "firebase/firestore";
import {
  db,
  eventAttendeesCol,
  userEventsAttendingCol
} from "../../config/firebaseConfig";
import { retrieveUserOverview } from "../user/usersService";
import { retrieveEventOverview } from "./eventsService";

export async function createEventAttendee(eventId: string, userId: string) {
  await runTransaction(db, async (transaction) => {
    const event = await retrieveEventOverview(eventId, transaction);
    const attendee = await retrieveUserOverview(userId, transaction);

    transaction
      .set(doc(eventAttendeesCol(eventId), userId), attendee)
      .set(doc(userEventsAttendingCol(userId), eventId), event);
  });
}

export function retrieveEventAttendeeCount(eventId: string) {
  return getCountFromServer(eventAttendeesCol(eventId)).then(
    (result) => result.data().count
  );
}

export function retrieveIsUserEventAttendee(userId: string, eventId: string) {
  return getCountFromServer(
    query(
      eventAttendeesCol(eventId),
      where(documentId(), "==", userId),
      limit(1)
    )
  ).then((result) => Boolean(result.data().count));
}

export async function deleteEventAttendee(eventId: string, userId: string) {
  const batch = writeBatch(db);
  batch
    .delete(doc(eventAttendeesCol(eventId), userId))
    .delete(doc(userEventsAttendingCol(userId), eventId));
  await batch.commit();
}
