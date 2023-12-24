import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { createUser, resetUser, usernameTaken } from "./usersService";

export function login(
  email: string,
  password: string,
  setErrMsg: React.Dispatch<React.SetStateAction<string>>
) {
  signInWithEmailAndPassword(auth, email, password).catch((e) => {
    if (e.code === "auth/invalid-login-credentials") {
      setErrMsg("Invalid login details.");
    } else {
      setErrMsg("Something went wrong. Try again later.");
    }
  });
}

export function register(
  name: string,
  email: string,
  password: string,
  setErrMsg: React.Dispatch<React.SetStateAction<string>>
) {
  usernameTaken(name)
    .then((invalidName) => {
      if (invalidName) {
        setErrMsg("Username taken.");
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCreds) => createUser(userCreds.user.uid, name))
          .catch((e) => {
            if (e.code === "auth/email-already-in-use") {
              setErrMsg("Email already linked to an account.");
            } else {
              setErrMsg("Something went wrong. Try again later.");
            }
          });
      }
    })
    .catch(() => setErrMsg("Something went wrong. Try again later."));
}

export function signOut() {
  auth
    .signOut()
    .then(resetUser)
    .catch((err) => console.log(err));
}
