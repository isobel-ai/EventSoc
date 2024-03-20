import {
  WriteBatch,
  doc,
  documentId,
  getCountFromServer,
  limit,
  query,
  runTransaction,
  where,
  writeBatch
} from "firebase/firestore";
import { db, eventAttendeesCol } from "../../config/firebaseConfig";
import { retrieveUserOverview } from "../user/usersService";
import {
  incrementEventAttendance,
  retrieveEventOverview,
  retrieveIsEventFull
} from "./eventsService";
import { isUndefined } from "lodash";
import {
  createUserEventAttending,
  deleteUserEventAttending
} from "../user/userEventsAttendingService";

export async function createEventAttendee(
  eventId: string,
  userId: string,
  ticketReserved?: boolean
) {
  await runTransaction(db, async (transaction) => {
    if (await retrieveIsEventFull(eventId, transaction)) {
      throw Error("Event Full");
    }

    const event = await retrieveEventOverview(eventId, transaction);
    const attendee = await retrieveUserOverview(userId, transaction);

    transaction.set(doc(eventAttendeesCol(eventId), userId), attendee);
    createUserEventAttending(userId, eventId, event, transaction);
    !ticketReserved && incrementEventAttendance(eventId, 1, transaction);
  });
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

/**
 * @param paramBatch is defined if the event is being deleted
 */
export async function deleteEventAttendee(
  eventId: string,
  userId: string,
  paramBatch?: WriteBatch
) {
  const batch = paramBatch ?? writeBatch(db);
  batch.delete(doc(eventAttendeesCol(eventId), userId));
  deleteUserEventAttending(userId, eventId, batch);
  if (isUndefined(paramBatch)) {
    incrementEventAttendance(eventId, -1, batch);
    await batch.commit();
  }
}
