import { getDoc, doc } from "firebase/firestore";
import { auth, usersCol } from "../config/firebaseConfig";
import { User, defaultUser } from "../models/User";

export function retrieveUser() {
  const id = auth.currentUser?.uid;
  return getDoc(doc(usersCol, id))
    .then((userSnapshot) => {
      return userSnapshot.exists()
        ? ({ ...userSnapshot.data(), id: id } as User)
        : defaultUser;
    })
    .catch((err) => {
      console.log(err);
      return defaultUser;
    });
}
