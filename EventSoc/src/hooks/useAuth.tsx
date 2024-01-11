import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (user) => {
      setLoggedIn(Boolean(user)), setUserId(user ? user.uid : "");
    });
    return unsubscribeFromAuthStateChanged;
  }, []);

  return { loggedIn, userId };
}
