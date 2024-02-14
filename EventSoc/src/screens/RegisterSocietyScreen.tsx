import ScreenView from "../components/general/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../navigation/SocietiesNavigator/SocietiesStackNavigator";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import ErrorAlertDialog, {
  ErrDialogState,
  defaultErrDialogState
} from "../components/error/ErrorAlertDialog";
import {
  SocietyData,
  defaultSocietyData
} from "../../../Shared/models/Society";
import SocietyForm from "../components/society/SocietyForm";
import { getSocietyErrMsg } from "../helpers/SocietyInputValidationHelper";
import { createSociety } from "../services/society/societiesService";
import { useUserContext } from "../contexts/UserContext";
import { UserOverview } from "../../../Shared/models/User";
import { retrieveUserOverview } from "../services/user/usersService";

type Props = StackScreenProps<SocietiesStackParamList, "Register Society">;

export default function RegisterScreen(props: Props) {
  const { userId } = useUserContext();

  const [society, setSociety] = useState<SocietyData>(defaultSocietyData);
  const [exec, setExec] = useState<UserOverview[]>([]);
  const [image, setImage] = useState<string>("");

  const [errDialogState, setErrDialogState] = useState<ErrDialogState>(
    defaultErrDialogState
  );

  const registerSociety = () => {
    const invalidErrMsg = getSocietyErrMsg(society);
    if (invalidErrMsg) {
      setErrDialogState({ message: invalidErrMsg, showDialog: true });
    } else {
      // Add user to exec
      retrieveUserOverview(userId)
        .then((user) => [...exec, user])
        .then((fullExec) => createSociety(society, image, fullExec))
        .then((result) => {
          if (result instanceof Error) {
            setErrDialogState({
              message: result.message,
              showDialog: true
            });
          } else {
            props.navigation.navigate("Society", { societyId: result });
            setErrDialogState({
              message: "",
              showDialog: false
            });
          }
        })
        .catch((err) => {
          console.error(err.message);
          setErrDialogState({
            message: "Couldn't register society. Try again later.",
            showDialog: true
          });
        });
    }
  };

  return (
    <ScreenView hasNavHeader>
      <SocietyForm
        {...{ society, setSociety, exec, setExec, image, setImage }}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={registerSociety}>
        <ButtonText>Register</ButtonText>
      </Button>
      <ErrorAlertDialog {...{ errDialogState, setErrDialogState }} />
    </ScreenView>
  );
}
