import { societyNamesCol, userNamesCol } from "../firestoreConfig";
import * as logger from "firebase-functions/logger";

export function createUserName(userId: string, name: string) {
  const doc = userNamesCol.doc(userId);
  doc
    .set({ id: userId, name: name })
    .then(() => logger.info(`${doc.path} created`))
    .catch((err) => logger.error(err.message));
}

export function createSocietyName(societyId: string, name: string) {
  const doc = societyNamesCol.doc(societyId);
  doc
    .set({ id: societyId, name: name })
    .then(() => logger.info(`${doc.path} created`))
    .catch((err) => logger.error(err.message));
}

export function updateUserName(userId: string, newName: string) {
  const doc = userNamesCol.doc(userId);
  doc
    .update({ name: newName })
    .then(() => logger.info(`${doc.path} updated`))
    .catch((err) => logger.error(err.message));
}

export function updateSocietyName(societyId: string, newName: string) {
  const doc = societyNamesCol.doc(societyId);
  doc
    .update({ name: newName })
    .then(() => logger.info(`${doc.path} updated`))
    .catch((err) => logger.error(err.message));
}
