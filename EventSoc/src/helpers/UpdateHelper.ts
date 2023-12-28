import { isEqual } from "lodash";
import { CreateEvent, UpdateEvent } from "../models/Event";
import { CreateSociety, UpdateSociety } from "../models/Society";

export function getEventUpdates(
  eventId: string,
  before: CreateEvent,
  after: CreateEvent
) {
  const updateEvent: UpdateEvent = { id: eventId };
  for (const [key, value] of Object.entries(after)) {
    if (!isEqual(value, before[key as keyof CreateEvent])) {
      updateEvent[key as keyof CreateEvent] = value;
    }
  }
  return updateEvent;
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
