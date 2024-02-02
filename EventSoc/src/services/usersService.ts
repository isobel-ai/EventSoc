import {
  doc,
  getCountFromServer,
  query,
  where,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { usersCol } from "../config/firebaseConfig";
import { User, UserData, defaultUserData } from "../../../Models/User";

export function retrieveUserData(id: string) {
  return getDoc(doc(usersCol, id))
    .then((userSnapshot) => <UserData>userSnapshot.data())
    .catch(() => {
      throw Error("User couldn't be retrieved. Try again later.");
    });
}

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
    .catch(() => {
      throw Error("Could not retrieve all users. Try again later.");
    });
}

export function createUser(id: string, name: string) {
  return setDoc(doc(usersCol, id), { ...defaultUserData(), name: name }).catch(
    () => {
      throw Error("Unable to create user. Try again later.");
    }
  );
}

export function updateUser(updates: Partial<UserData>, userId: string) {
  return updateDoc(doc(usersCol, userId), updates).catch(() => {
    throw Error("Unable to update user. Try again later.");
  });
}

export function addNotificationToken(userId: string, token: string) {
  return updateDoc(doc(usersCol, userId), {
    notificationTokens: arrayUnion(token)
  }).catch(() => {
    throw Error("Unable to add notification token. Try again later.");
  });
}

export function removeNotificationToken(userId: string, token: string) {
  return updateDoc(doc(usersCol, userId), {
    notificationTokens: arrayRemove(token)
  }).catch(() => {
    throw Error("Unable to remove notification token. Try again later.");
  });
}

export function usernameTaken(name: string) {
  return getCountFromServer(query(usersCol, where("name", "==", name)))
    .then((result) => Boolean(result.data().count))
    .catch(() => {
      throw Error("Something went wrong. Try again later.");
    });
}
