import { societyEventsColGroup } from "../../firestoreConfig";
import { EventOverview } from "../../../../Shared/models/Event";
import { updateQueryDocs } from "../queryDocsService";

export function updateSocietyEvents(
  eventId: string,
  data: Partial<EventOverview>
) {
  updateQueryDocs(societyEventsColGroup.where("id", "==", eventId), data);
}
