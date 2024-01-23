import { Button, ButtonText, Heading } from "@gluestack-ui/themed";
import ScreenView from "../components/ScreenView";
import { useState } from "react";
import { signOut } from "../services/authService";
import ErrorAlertDialog from "../components/ErrorAlertDialog";
import { useAppContext } from "../contexts/AppContext";

export default function MyAccountScreen() {
  const { users, userId } = useAppContext();

  const user = users.find((user) => user.id === userId);

  const [logoutErrMsg, setLogoutErrMsg] = useState<string>("");
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);

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
