import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { createUser, usernameTaken } from "./usersService";

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
export async function register(name: string, email: string, password: string) {
  return usernameTaken(name)
    .catch((err) => {
      throw err;
    })
    .then((isUserNameTaken) => {
      if (isUserNameTaken) {
        throw Error("Username taken.");
      } else {
        return createUserWithEmailAndPassword(auth, email, password)
          .then((userCreds) =>
            createUser(userCreds.user.uid, name).catch((err) => {
              deleteUser(userCreds.user);
              throw err;
            })
          )
          .catch((e) => {
            if (e.code === "auth/email-already-in-use") {
              throw Error("Email already linked to an account.");
            } else {
              throw Error("Something went wrong. Try again later.");
            }
          });
      }
    });
}

export function signOut() {
  return auth.signOut().catch(() => {
    throw Error("Something went wrong. Try again later.");
  });
}
