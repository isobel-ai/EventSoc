import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import ErrorAlertDialog from "../../components/ErrorAlertDialog";
import { CreateSociety, defaultCreateSociety } from "../../models/Society";
import SocietyForm from "../../components/SocietyForm";
import { getSocietyErrMsg } from "../../helpers/SocietyInputValidationHelper";
import { createSociety } from "../../services/societiesService";
import { retrieveUser } from "../../services/usersService";

type Props = StackScreenProps<SocietiesStackParamList, "Register Society">;

export default function RegisterScreen(props: Props) {
  const [createSoc, setCreateSoc] =
    useState<CreateSociety>(defaultCreateSociety);

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const registerSociety = () => {
    // Add user to exec
    retrieveUser().then((user) => {
      const fullExec = createSoc.exec.slice();
      if (user.name) {
        fullExec.push(user.name);
      }
      const fullCreateSoc = { ...createSoc, exec: fullExec };

      const invalidErrMsg = getSocietyErrMsg(fullCreateSoc);
      if (invalidErrMsg) {
        setErrMsg(invalidErrMsg);
        setShowAlertDialog(true);
      } else {
        createSociety(fullCreateSoc).then((result) => {
          if (result instanceof Error) {
            setErrMsg(result.message);
            setShowAlertDialog(true);
          } else {
            props.navigation.navigate("Home", { societyId: "" });
          }
        });
      }
    });
  };

  return (
    <ScreenView>
      <SocietyForm
        createSociety={createSoc}
        setCreateSociety={setCreateSoc}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={registerSociety}>
        <ButtonText>Register</ButtonText>
      </Button>
      <ErrorAlertDialog {...{ showAlertDialog, setShowAlertDialog, errMsg }} />
    </ScreenView>
  );
}
