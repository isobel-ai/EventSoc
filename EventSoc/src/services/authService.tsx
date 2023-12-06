import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth, usersCol } from "../config/firebaseConfig";
import {
  doc,
  getCountFromServer,
  query,
  setDoc,
  where
} from "firebase/firestore";

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

async function usernameTaken(name: string) {
  const users = await getCountFromServer(
    query(usersCol, where("name", "==", name))
  );
  return Boolean(users.data().count);
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
          .then((userCreds) => {
            setDoc(doc(usersCol, userCreds.user.uid), { name: name });
          })
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
  auth.signOut().catch((err) => console.log(err));
}
