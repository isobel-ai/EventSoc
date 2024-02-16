import {
  eventAttendeesCol,
  eventAttendeesColGroup
} from "../../firestoreConfig";
import { UserOverview } from "../../../../Shared/models/User";
import { updateQueryDocs } from "../queryService";

export function retrieveEventAttendeeNotifTokens(eventId: string) {
  return eventAttendeesCol(eventId)
    .get()
    .then((eventsSnapshot) =>
      eventsSnapshot.docs.flatMap(
        (doc) => (<UserOverview>doc.data()).notificationTokens
      )
    );
}

export function updateEventAttendees(
  userId: string,
  data: Partial<UserOverview>
) {
  updateQueryDocs(eventAttendeesColGroup.where("id", "==", userId), data);
}
