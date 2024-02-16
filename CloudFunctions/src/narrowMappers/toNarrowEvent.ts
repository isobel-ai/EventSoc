import { EventData, EventOverview } from "../../../Shared/models/Event";
import { isUndefined } from "lodash";

export function eventToOverviewUpdates(eventDataUpdates: Partial<EventData>) {
  const eventOverviewUpdates: Partial<EventOverview> = {};
  if (!isUndefined(eventDataUpdates.name)) {
    eventOverviewUpdates.name = eventDataUpdates.name;
  }
  if (!isUndefined(eventDataUpdates.startDate)) {
    eventOverviewUpdates.startDate = eventDataUpdates.startDate;
  }
  if (!isUndefined(eventDataUpdates.endDate)) {
    eventOverviewUpdates.endDate = eventDataUpdates.endDate;
  }
  return eventOverviewUpdates;
}
