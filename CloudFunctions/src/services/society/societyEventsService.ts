import { societyEventsColGroup } from "../../firestoreConfig";
import { EventOverview } from "../../../../Shared/models/Event";
import { deleteQueryDocs, updateQueryDocs } from "../queryService";

export function updateSocietyEvents(
  eventId: string,
  data: Partial<EventOverview>
) {
  updateQueryDocs(societyEventsColGroup.where("id", "==", eventId), data);
}

export function deleteSocietyEvents(eventId: string) {
  deleteQueryDocs(societyEventsColGroup.where("id", "==", eventId));
}
