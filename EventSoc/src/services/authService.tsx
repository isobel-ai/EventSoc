import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

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
