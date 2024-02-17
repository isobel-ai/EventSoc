import { societyNamesCol, userNamesCol } from "../firestoreConfig";

export function createUserName(userId: string, name: string) {
  return userNamesCol.doc(userId).set({ id: userId, name: name });
}

export async function createSocietyName(societyId: string, name: string) {
  await societyNamesCol.doc(societyId).set({ id: societyId, name: name });
}

export function updateUserName(userId: string, newName: string) {
  return userNamesCol.doc(userId).update({ name: newName });
}

export function updateSocietyName(societyId: string, newName: string) {
  return societyNamesCol.doc(societyId).update({ name: newName });
}
