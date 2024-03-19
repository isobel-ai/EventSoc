import {
  CollectionReference,
  DocumentData,
  Transaction,
  doc,
  getCountFromServer,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { societyNamesCol, userNamesCol } from "../config/firebaseConfig";
import { docToModel } from "../mappers/docToModel";
import { Name } from "../../../Shared/models/Name";

export function retrieveUserNames() {
  return retrieveNames(userNamesCol);
}

export function retrieveDoesUsernameExist(name: string) {
  return getCountFromServer(
    query(userNamesCol, where("name", "==", name))
  ).then((result) => Boolean(result.data().count));
}

export function retrieveSocietyName(socId: string, transaction: Transaction) {
  return transaction.get(doc(societyNamesCol, socId)).then(docToModel<Name>);
}

export function retrieveSocietyNames() {
  return retrieveNames(societyNamesCol);
}

export function retrieveDoesSocietyNameExist(name: string) {
  return getCountFromServer(
    query(societyNamesCol, where("name", "==", name))
  ).then((result) => Boolean(result.data().count));
}

function retrieveNames(col: CollectionReference<DocumentData, DocumentData>) {
  return getDocs(col).then((namesSnapshot) => {
    const unorderedNames = namesSnapshot.docs.map(docToModel<Name>);
    return unorderedNames.sort((a, b) => a.name.localeCompare(b.name));
  });
}
