import {
  getDoc,
  doc,
  getCountFromServer,
  query,
  where,
  setDoc,
  getDocs
} from "firebase/firestore";
import { auth, usersCol } from "../config/firebaseConfig";
import { RetrieveUser, defaultRetrieveUser, defaultUser } from "../models/User";
import { isEqual } from "lodash";
import { sortByString } from "../helpers/SearchSortHelper";

let user: RetrieveUser = defaultRetrieveUser();

export function resetUser() {
  user = defaultRetrieveUser();
}

export async function retrieveUser() {
  // Retrieve user if the function hasn't been called before
  if (isEqual(user, defaultRetrieveUser())) {
    const id = auth.currentUser?.uid;
    Object.assign(
      user,
      await getDoc(doc(usersCol, id))
        .then((userSnapshot) => {
          return userSnapshot.exists()
            ? ({ ...userSnapshot.data(), id: id } as RetrieveUser)
            : user;
        })
        .catch((err) => {
          console.log(err);
          return user;
        })
    );
  }

  return user;
}

export function retrieveUsers() {
  return getDocs(usersCol)
    .then((usersSnapshot) => {
      const userList = usersSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as RetrieveUser;
      });
      return userList.sort((s1, s2) => sortByString(s1, s2, "name"));
    })
    .catch((err) => console.log("Error: ", err));
}

export function retrieveOtherUsers() {
  retrieveUser(); // Set user if not already set

  return getDocs(query(usersCol, where("name", "!=", user.name)))
    .then((usersSnapshot) => {
      const userList = usersSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as RetrieveUser;
      });
      return userList.sort((s1, s2) => sortByString(s1, s2, "name"));
    })
    .catch((err) => {
      console.log("Error: ", err);
      return <RetrieveUser[]>[];
    });
}

export function createUser(id: string, name: string) {
  setDoc(doc(usersCol, id), { ...defaultUser(), name: name }).catch((err) =>
    console.log(err)
  );
}

export async function usernameTaken(name: string) {
  const users = await getCountFromServer(
    query(usersCol, where("name", "==", name))
  );
  return Boolean(users.data().count);
}
