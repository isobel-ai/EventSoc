import {
  doc,
  getCountFromServer,
  query,
  where,
  setDoc,
  getDocs
} from "firebase/firestore";
import { usersCol } from "../config/firebaseConfig";
import { User, UserData, defaultUserData } from "../models/User";

export function retrieveUsers() {
  return getDocs(usersCol)
    .then((usersSnapshot) => {
      const unorderedUsers = usersSnapshot.docs.map(
        (doc) => <User>{ id: doc.id, data: doc.data() }
      );
      return unorderedUsers.sort((a, b) =>
        a.data.name.localeCompare(b.data.name)
      );
    })
    .catch(() => Error("Could not retrieve all users. Try again later."));
}

export function createUser(id: string, name: string) {
  return setDoc(doc(usersCol, id), { ...defaultUserData(), name: name }).catch(
    () => Error("Unable to create user. Try again later.")
  );
}

export function usernameTaken(name: string) {
  return getCountFromServer(query(usersCol, where("name", "==", name)))
    .then((result) => Boolean(result.data().count))
    .catch(() => Error("Something went wrong. Try again later."));
}
