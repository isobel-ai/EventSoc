import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { createUser, resetUser, usernameTaken } from "./usersService";

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password).catch((e) => {
    if (e.code === "auth/invalid-login-credentials") {
      return Error("Invalid login details.");
    } else {
      return Error("Something went wrong. Try again later.");
    }
  });
}

export async function register(name: string, email: string, password: string) {
  return usernameTaken(name).then((result) => {
    if (result instanceof Error) {
      return result;
    } else if (result) {
      return Error("Username taken.");
    } else {
      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCreds) =>
          createUser(userCreds.user.uid, name).then((result) => {
            if (result instanceof Error) {
              deleteUser(userCreds.user);
              return result;
            }
          })
        )
        .catch((e) => {
          if (e.code === "auth/email-already-in-use") {
            return Error("Email already linked to an account.");
          } else {
            return Error("Something went wrong. Try again later.");
          }
        });
    }
  });
}

export function signOut() {
  return auth
    .signOut()
    .then(resetUser)
    .catch(() => Error("Something went wrong. Try again later."));
}
