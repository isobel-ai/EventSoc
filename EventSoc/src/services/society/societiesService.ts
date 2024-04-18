import {
  Transaction,
  doc,
  getDoc,
  runTransaction,
  writeBatch
} from "firebase/firestore";
import {
  db,
  societiesCol,
  societyPicturesRef
} from "../../config/firebaseConfig";
import { SocietyData } from "../../../../Shared/models/Society";
import { downloadImage, updateImage, uploadImage } from "../storageService";
import { UserOverview } from "../../../../Shared/models/User";
import { isUndefined } from "lodash";
import {
  createSocietyExec,
  retrieveSocietyExec,
  updateSocietyExec
} from "./societyExecService";
import { docToModel } from "../../mappers/docToModel";
import { ArrayUpdates } from "../../helpers/UpdateHelper";
import {
  retrieveSocietyName,
  retrieveDoesSocietyNameExist
} from "../namesService";
import { docToSocietyOverviewNarrow } from "../../mappers/docToSociety";

export async function createSociety(
  society: SocietyData,
  image: string,
  exec: UserOverview[]
) {
  const socRef = doc(societiesCol);

  if (image) {
    await uploadImage(image, societyPicturesRef, socRef.id);
  }

  const batch = writeBatch(db);
  batch.set(socRef, society);
  createSocietyExec(socRef.id, society.name, exec, batch);
  await batch.commit();

  return socRef.id;
}

export function retrieveSocietyData(id: string) {
  return getDoc(doc(societiesCol, id)).then(docToModel<SocietyData>);
}

export async function retrieveSocietyOverview(
  societyId: string,
  transaction: Transaction
) {
  const socDoc = await transaction.get(doc(societiesCol, societyId));
  const exec = await retrieveSocietyExec(societyId); // Can't use transaction to retrieve collection
  return docToSocietyOverviewNarrow(socDoc, exec);
}

export function retrieveSocietyImage(societyId: string) {
  return downloadImage(societyPicturesRef, societyId);
}

export async function updateSociety(
  societyId: string,
  socUpdates: Partial<SocietyData>,
  execUpdates: ArrayUpdates<UserOverview>,
  newImage?: string
) {
  if (
    !isUndefined(socUpdates.name) &&
    (await retrieveDoesSocietyNameExist(socUpdates.name))
  ) {
    return "Society name taken.";
  }

  if (!isUndefined(newImage)) {
    await updateImage(societyPicturesRef, societyId, newImage);
  }
  await runTransaction(db, async (transaction) => {
    const socName = await retrieveSocietyName(societyId, transaction);

    transaction.update(doc(societiesCol, societyId), socUpdates);
    updateSocietyExec(socName, execUpdates, transaction);
  });
}
