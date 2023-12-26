import { isEqual } from "lodash";
import { CreateSocEvent, UpdateSocEvent } from "../models/SocEvent";
import { CreateSociety, UpdateSociety } from "../models/Society";

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

export function getSocietyUpdates(
  socId: string,
  before: CreateSociety,
  after: CreateSociety
) {
  const updateSoc: UpdateSociety = { id: socId };
  for (const [key, value] of Object.entries(after)) {
    if (!isEqual(value, before[key as keyof CreateSociety])) {
      updateSoc[key as keyof CreateSociety] = value;
    }
  }
  return updateSoc;
}
