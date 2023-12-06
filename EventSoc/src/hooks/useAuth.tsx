import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export function useAuth() {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (user) =>
      setLoggedIn(Boolean(user))
    );
    return unsubscribeFromAuthStateChanged;
  }, []);

  return loggedIn;
}
