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

  const [user, setUser] = useState<User | undefined>(getUser);

  const [logoutErrMsg, setLogoutErrMsg] = useState<string>("");
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => setUser(getUser()), [isFocused]);

  return (
    <ScreenView>
      {user && <Heading textAlign="center">Name: {user.data.name}</Heading>}
      <Button
        action={"negative"}
        borderRadius="$none"
        onPress={() =>
          signOut().catch((err) => {
            setLogoutErrMsg(err.message);
            setShowErrorDialog(true);
          })
        }>
        <ButtonText>Logout</ButtonText>
      </Button>
      <ErrorAlertDialog
        isVisible={showErrorDialog}
        setIsVisible={setShowErrorDialog}
        errMsg={logoutErrMsg}
      />
    </ScreenView>
  );
}
