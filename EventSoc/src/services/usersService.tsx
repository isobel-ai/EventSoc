import { getDoc, doc } from "firebase/firestore";
import { usersCol } from "../config/firebaseConfig";
import { User, defaultUser } from "../models/User";

export function getUser(id: string) {
  return getDoc(doc(usersCol, id)).then((userSnapshot) => {
    return userSnapshot.exists()
      ? ({ ...userSnapshot.data(), id: id } as User)
      : defaultUser;
  });
}
