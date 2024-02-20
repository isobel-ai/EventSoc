import {
  doc,
  getCountFromServer,
  query,
  where,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Transaction
} from "firebase/firestore";
import { usersCol } from "../../config/firebaseConfig";
import { UserData, defaultUserData } from "../../../../Shared/models/User";
import { docToModel } from "../../mappers/docToModel";
import { docToUserOverviewNarrow } from "../../mappers/docToUser";
import { isUndefined } from "lodash";

export function createUser(id: string, name: string) {
  return setDoc(doc(usersCol, id), { ...defaultUserData(), name: name });
}

export function retrieveUserData(userId: string) {
  return getDoc(doc(usersCol, userId)).then(docToModel<UserData>);
}

export function retrieveUserOverview(
  userId: string,
  transaction?: Transaction
) {
  return isUndefined(transaction)
    ? getDoc(doc(usersCol, userId)).then(docToUserOverviewNarrow)
    : transaction.get(doc(usersCol, userId)).then(docToUserOverviewNarrow);
}

export function retrieveDoesUsernameExist(name: string) {
  return getCountFromServer(query(usersCol, where("name", "==", name))).then(
    (result) => Boolean(result.data().count)
  );
}

export async function createUserInterest(userId: string, interest: string) {
  await updateDoc(doc(usersCol, userId), { interests: arrayUnion(interest) });
}

export async function deleteUserInterest(userId: string, interest: string) {
  await updateDoc(doc(usersCol, userId), { interests: arrayRemove(interest) });
}

export async function createUserNotificationToken(
  userId: string,
  token: string
) {
  await updateDoc(doc(usersCol, userId), {
    notificationTokens: arrayUnion(token)
  });
}

export async function deleteUserNotificationToken(
  userId: string,
  token: string
) {
  await updateDoc(doc(usersCol, userId), {
    notificationTokens: arrayRemove(token)
  });
}
