import { EventOverview } from "../../../../Shared/models/Event";
import { userEventsAttendingColGroup } from "../../firestoreConfig";
import { deleteQueryDocs, updateQueryDocs } from "../queryDocsService";

export function updateUserEventsAttending(
  eventId: string,
  data: Partial<EventOverview>
) {
  updateQueryDocs(userEventsAttendingColGroup.where("id", "==", eventId), data);
}

export function deleteUserEventsAttending(eventId: string) {
  deleteQueryDocs(userEventsAttendingColGroup.where("id", "==", eventId));
}
