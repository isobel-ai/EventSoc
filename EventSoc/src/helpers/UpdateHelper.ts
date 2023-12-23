import { isEqual } from "lodash";
import { CreateSocEvent, UpdateSocEvent } from "../models/SocEvent";
import { equalDate } from "./DateTimeHelper";

export function getEventUpdates(
  eventId: string,
  before: CreateSocEvent,
  after: CreateSocEvent
) {
  const updateSocEvent: UpdateSocEvent = { id: eventId };
  for (const [key, value] of Object.entries(after)) {
    if (!isEqual(value, before[key as keyof CreateSocEvent])) {
      updateSocEvent[key as keyof CreateSocEvent] = value;
    }
  }
  return updateSocEvent;
}
