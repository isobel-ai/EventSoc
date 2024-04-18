import ScreenView from "../components/general/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../navigation/SocietiesNavigator/SocietiesStackNavigator";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
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
import useDismissableToast from "../hooks/useDismissableToast";
import { createAccount, createAccountLink } from "../services/stripeService";
import { retrieveDoesSocietyNameExist } from "../services/namesService";
import { openURL } from "expo-linking";
import { AppState } from "react-native";

type Props = StackScreenProps<SocietiesStackParamList, "Register Society">;

export default function RegisterScreen(props: Props) {
  const { userId } = useUserContext();

  const [society, setSociety] = useState<SocietyData>(defaultSocietyData);
  const [exec, setExec] = useState<UserOverview[]>([]);
  const [image, setImage] = useState<string>("");

  const [errDialogState, setErrDialogState] = useState<ErrDialogState>(
    defaultErrDialogState
  );

  const handleRegSocError = (err: any) => {
    console.error(err.message);
    setErrDialogState({
      message: "Couldn't register society. Try again later.",
      showDialog: true
    });
  };

  const registerSociety = async () => {
    const invalidErrMsg = getSocietyErrMsg(society);
    if (invalidErrMsg) {
      setErrDialogState({ message: invalidErrMsg, showDialog: true });
    } else {
      try {
        if (await retrieveDoesSocietyNameExist(society.name)) {
          setErrDialogState({
            message: "Society name taken.",
            showDialog: true
          });
        } else {
          // Triggers 'create society' useEffect
          setSociety({
            ...society,
            stripeID: await createAccount(society.name)
          });
        }
      } catch (err: any) {
        handleRegSocError(err);
      }
    }
  };

  const showRegisterSocSuccessToast = useDismissableToast();

  useEffect(() => {
    if (society.stripeID) {
      createAccountLink(society.stripeID).then(openURL);

      const listener = AppState.addEventListener("change", async (state) => {
        if (state === "active") {
          try {
            // Add user to exec
            const fullExec = await retrieveUserOverview(userId).then((user) => [
              ...exec,
              user
            ]);

            const socID = await createSociety(society, image, fullExec);

            props.navigation.navigate("Society", { societyId: socID });
            showRegisterSocSuccessToast({
              title: `${society.name} registered`,
              action: "success"
            });
            setErrDialogState({
              message: "",
              showDialog: false
            });
          } catch (err: any) {
            handleRegSocError(err);
          }
        }
      });

      return listener.remove;
    }
  }, [society.stripeID]);

  return (
    <ScreenView useTopPadding>
      <SocietyForm
        {...{ society, setSociety, exec, setExec, image, setImage }}
      />
      <Button
        size="xl"
        action="positive"
        placement="absoluteBottom"
        onPress={registerSociety}>
        <ButtonText>Register</ButtonText>
      </Button>
      <ErrorAlertDialog {...{ errDialogState, setErrDialogState }} />
    </ScreenView>
  );
}
