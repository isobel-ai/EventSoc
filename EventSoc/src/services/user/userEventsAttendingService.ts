import { getDocs, query, orderBy, WriteBatch, doc } from "firebase/firestore";
import { userEventsAttendingCol } from "../../config/firebaseConfig";
import { docToEventOverviewNarrow } from "../../mappers/docToEvent";

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
