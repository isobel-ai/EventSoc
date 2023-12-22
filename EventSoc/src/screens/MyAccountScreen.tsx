import { Button, ButtonText, Heading } from "@gluestack-ui/themed";
import ScreenView from "../components/ScreenView";
import { RetrieveUser, defaultRetrieveUser } from "../models/User";
import { useEffect, useState } from "react";
import { retrieveUser } from "../services/usersService";
import { useIsFocused } from "@react-navigation/native";
import { signOut } from "../services/authService";

export default function MyAccountScreen() {
  const [user, setUser] = useState<RetrieveUser>(defaultRetrieveUser());

  const isFocused = useIsFocused();

  useEffect(() => {
    retrieveUser().then((user) => setUser(user));
  }, [isFocused]);

  return (
    <ScreenView>
      {user.name && <Heading textAlign="center">Name: {user.name}</Heading>}
      <Button
        action={"negative"}
        onPress={signOut}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </ScreenView>
  );
}
