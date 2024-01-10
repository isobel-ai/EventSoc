import { Button, ButtonText, Heading } from "@gluestack-ui/themed";
import ScreenView from "../components/ScreenView";
import { User } from "../models/User";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { signOut } from "../services/authService";
import ErrorAlertDialog from "../components/ErrorAlertDialog";
import { useAppContext } from "../contexts/AppContext";

export default function MyAccountScreen() {
  const { getUser } = useAppContext();

  const [user, setUser] = useState<User>();

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    retrieveUser().then((user) => setUser(user));
  }, [isFocused]);

  return (
    <ScreenView>
      {user && <Heading textAlign="center">Name: {user.data.name}</Heading>}
      <Button
        action={"negative"}
        borderRadius="$none"
        onPress={() =>
          signOut().then((result) => {
            if (result instanceof Error) {
              setErrMsg(result.message);
              setShowAlertDialog(true);
            }
          })
        }>
        <ButtonText>Logout</ButtonText>
      </Button>
      <ErrorAlertDialog {...{ showAlertDialog, setShowAlertDialog, errMsg }} />
    </ScreenView>
  );
}
