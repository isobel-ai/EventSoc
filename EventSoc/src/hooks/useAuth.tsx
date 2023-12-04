import React, { useEffect } from "react";
import { Unsubscribe, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export function useAuth() {
  const [userID, setUserID] = React.useState<string>();

  useEffect(() => {
    const unsubscribeFromAuthStateChanged: Unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          // Logged in
          setUserID(user.uid);
        } else {
          // Logged out
          setUserID(undefined);
        }
      }
    );

    return unsubscribeFromAuthStateChanged;
  }, []);

  return { userID };
}
