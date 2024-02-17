import { getDocs, query, orderBy } from "firebase/firestore";
import { userEventsAttendingCol } from "../../config/firebaseConfig";
import { docToEventOverviewNarrow } from "../../mappers/docToEvent";

export function retrieveUserEventsAttendingOverviews(userId: string) {
  return getDocs(
    query(userEventsAttendingCol(userId), orderBy("startDate", "desc"))
  ).then((eventsSnapshot) => eventsSnapshot.docs.map(docToEventOverviewNarrow));
}
