import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { createUser, retrieveDoesUsernameExist } from "./user/usersService";

/**
 * @returns whether the sign in attempt is successful
 */
export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
    .then(() => true)
    .catch((err) => {
      if (err.code === "auth/invalid-login-credentials") {
        return false;
      }

      throw Error(err);
    });
}

/**
 * @returns error message if registration is unsuccessful
 */
export async function register(name: string, email: string, password: string) {
  return retrieveDoesUsernameExist(name)
    .catch((err) => {
      throw err;
    })
    .then((isUserNameTaken) => {
      if (isUserNameTaken) {
        return "Username taken";
      }

      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCreds) =>
          createUser(userCreds.user.uid, name).catch((err) => {
            deleteUser(userCreds.user).catch((err) =>
              console.error(err.message)
            );
            throw err;
          })
        )
        .catch((err) => {
          if (err.code === "auth/email-already-in-use") {
            return "Email already linked to an account.";
          }

          throw err;
        });
    });
}

export async function signOut() {
  await auth.signOut();
}
