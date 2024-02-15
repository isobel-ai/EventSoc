import { isEmpty, isEqual, isUndefined } from "lodash";

export function getUpdates<Obj extends object>(before: Obj, after: Obj) {
  const updates: Partial<Obj> = {};
  for (const [key, value] of Object.entries(after)) {
    if (!isEqual(value, before[key as keyof Obj])) {
      updates[key as keyof Obj] = value;
    }
  }
  return updates;
}

export type ArrayUpdates<Obj> = {
  createObjs: Obj[];
  updateObjs: Partial<Obj>[];
  deleteObjs: Obj[];
};

export function getArrayUpdates<Obj extends { id: string }>(
  before: Obj[],
  after: Obj[]
) {
  let arrayUpdates = <ArrayUpdates<Obj>>{
    createObjs: [],
    updateObjs: [],
    deleteObjs: []
  };

  const compareId = (obj1: Obj, obj2: Obj) => obj1.id.localeCompare(obj2.id);

  const sortedB = before.sort(compareId);
  const sortedA = after.sort(compareId);

  let bIndex = 0;
  let aIndex = 0;

  while (bIndex < sortedB.length && aIndex < sortedA.length) {
    const comparison = compareId(sortedB[bIndex], sortedA[aIndex]);
    if (comparison > 0) {
      arrayUpdates.createObjs.push(sortedA[aIndex++]);
    } else if (comparison === 0) {
      const objUpdates = getUpdates(sortedB[bIndex], sortedA[aIndex]);
      !isEmpty(objUpdates) &&
        arrayUpdates.updateObjs.push({ ...objUpdates, id: sortedB[bIndex].id });
      aIndex++;
      bIndex++;
    } else {
      // comparison < 0
      arrayUpdates.deleteObjs.push(sortedB[bIndex++]);
    }
  }
  while (bIndex < sortedB.length) {
    arrayUpdates.deleteObjs.push(sortedB[bIndex++]);
  }
  while (aIndex < sortedA.length) {
    arrayUpdates.createObjs.push(sortedA[aIndex++]);
  }

  return arrayUpdates;
}
