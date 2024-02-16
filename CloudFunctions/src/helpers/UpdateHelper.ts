import { isEqual } from "lodash";
import { EventData, eventDetailKeys } from "../../../Shared/models/Event";

export function hasEventBeenUpdated(before: EventData, after: EventData) {
  return eventDetailKeys.some(
    (key) =>
      !isEqual(before[key as keyof EventData], after[key as keyof EventData])
  );
}

export function getUpdates<Obj extends object>(before: Obj, after: Obj) {
  const updates: Partial<Obj> = {};
  for (const [key, value] of Object.entries(after)) {
    if (!isEqual(value, before[key as keyof Obj])) {
      updates[key as keyof Obj] = value;
    }
  }
  return updates;
}
