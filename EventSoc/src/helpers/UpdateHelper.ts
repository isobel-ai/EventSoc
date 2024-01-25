import { isEqual } from "lodash";

export function getUpdates<Obj extends object>(before: Obj, after: Obj) {
  const updates: Partial<Obj> = {};
  for (const [key, value] of Object.entries(after)) {
    if (!isEqual(value, before[key as keyof Obj])) {
      updates[key as keyof Obj] = value;
    }
  }
  return updates;
}
