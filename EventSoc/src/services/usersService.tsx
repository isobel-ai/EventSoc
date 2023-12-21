import { getDoc, doc } from "firebase/firestore";
import { auth, usersCol } from "../config/firebaseConfig";
import { User, defaultUser } from "../models/User";
import { isEqual } from "lodash";

const user: User = defaultUser();

export async function retrieveUser() {
  // Retrieve user if the function hasn't been called before
  if (isEqual(user, defaultUser())) {
    const id = auth.currentUser?.uid;
    Object.assign(
      user,
      await getDoc(doc(usersCol, id))
        .then((userSnapshot) => {
          return userSnapshot.exists()
            ? ({ ...userSnapshot.data(), id: id } as User)
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
