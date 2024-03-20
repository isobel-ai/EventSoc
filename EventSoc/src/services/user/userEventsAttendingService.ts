import {
  getDocs,
  query,
  orderBy,
  WriteBatch,
  doc,
  Transaction
} from "firebase/firestore";
import { userEventsAttendingCol } from "../../config/firebaseConfig";
import { docToEventOverviewNarrow } from "../../mappers/docToEvent";
import { EventOverview } from "../../../../Shared/models/Event";

export function createUserEventAttending(
  userId: string,
  eventId: string,
  event: EventOverview,
  transaction: Transaction
) {
  return transaction.set(doc(userEventsAttendingCol(userId), eventId), event);
}

export function retrieveUserEventsAttendingOverviews(userId: string) {
  return getDocs(
    query(userEventsAttendingCol(userId), orderBy("startDate", "desc"))
  ).then((eventsSnapshot) => eventsSnapshot.docs.map(docToEventOverviewNarrow));
}

export function updateUserEventAttendingName(
  userId: string,
  eventId: string,
  newName: string,
  batch: WriteBatch
) {
  batch.update(doc(userEventsAttendingCol(userId), eventId), { name: newName });
}

export function deleteUserEventAttending(
  userId: string,
  eventId: string,
  batch: WriteBatch
) {
  return batch.delete(doc(userEventsAttendingCol(userId), eventId));
}
