import { Button, ButtonText, Heading } from "@gluestack-ui/themed";
import ScreenView from "../components/ScreenView";
import { RetrieveUser, defaultRetrieveUser } from "../models/User";
import { useEffect, useState } from "react";
import { retrieveUser } from "../services/usersService";
import { useIsFocused } from "@react-navigation/native";
import { signOut } from "../services/authService";
import ErrorAlertDialog from "../components/ErrorAlertDialog";

export default function MyAccountScreen() {
  const [user, setUser] = useState<RetrieveUser>(defaultRetrieveUser());

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    retrieveUser().then((user) => setUser(user));
  }, [isFocused]);

  return (
    <ScreenView>
      {user.name && <Heading textAlign="center">Name: {user.name}</Heading>}
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
