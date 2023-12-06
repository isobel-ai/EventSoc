import { Button, ButtonText, Heading } from "@gluestack-ui/themed";
import ScreenView from "../components/ScreenView";
import { User, defaultUser } from "../models/User";
import { useEffect, useState } from "react";
import { getUser } from "../services/usersService";
import { useIsFocused } from "@react-navigation/native";
import { signOut } from "../services/authService";

export default function MyAccountScreen() {
  const [user, setUser] = useState<User>(defaultUser);

  const isFocused = useIsFocused();

  useEffect(() => {
    getUser().then((user) => setUser(user));
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
