import React, { useEffect } from "react";
import { Unsubscribe, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { User } from "../models/User";
import { getName } from "../services/authService";

export function useAuth() {
  const [user, setUser] = React.useState<User>();

  useEffect(() => {
    const unsubscribeFromAuthStateChanged: Unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          // Logged in
          getName(user.uid)
            .then((name) => setUser({ id: user.uid, name: name }))
            .catch((err) => console.log(err));
        } else {
          // Logged out
          setUser(undefined);
        }
      }
    );

    return unsubscribeFromAuthStateChanged;
  }, []);

  return { user };
}
