import { EventData, EventOverview } from "../../../Shared/models/Event";

export function eventDataToOverview(eventId: string, data: EventData) {
  const overview: EventOverview = {
    id: eventId,
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
    organiserId: data.organiser.id
  };
  return overview;
}
