import {
  setDoc,
  doc,
  getDocs,
  deleteDoc,
  query,
  where,
  getCountFromServer,
  documentId,
  limit,
  runTransaction
} from "firebase/firestore";
import { userSocietiesFollowingCol, db } from "../../config/firebaseConfig";
import { docToModel } from "../../mappers/docToModel";
import { Name } from "../../../../Shared/models/Name";
import { retrieveSocietyName } from "../namesService";

export async function createUserSocietyFollow(
  userId: string,
  societyId: string
) {
  await runTransaction(db, async (transaction) => {
    const societyName = await retrieveSocietyName(societyId, transaction);

    transaction.set(doc(userSocietiesFollowingCol(userId), societyId), {
      id: societyId,
      name: societyName
    });
  });
}

export function retrieveUserSocietiesFollowing(userId: string) {
  return getDocs(userSocietiesFollowingCol(userId)).then((societiesSnapshot) =>
    societiesSnapshot.docs.map(docToModel<Name>)
  );
}

export function retrieveIsUserFollowingSociety(
  userId: string,
  societyId: string
) {
  return getCountFromServer(
    query(
      userSocietiesFollowingCol(userId),
      where(documentId(), "==", societyId),
      limit(1)
    )
  ).then((result) => Boolean(result.data().count));
}

export async function deleteUserSocietyFollow(
  userId: string,
  societyId: string
) {
  await deleteDoc(doc(userSocietiesFollowingCol(userId), societyId));
}
