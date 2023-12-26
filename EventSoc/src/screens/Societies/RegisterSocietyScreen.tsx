import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import StyledAlertDialog from "../../components/StyledAlertDialog";
import { CreateSociety, defaultCreateSociety } from "../../models/Society";
import SocietyForm from "../../components/SocietyForm";
import { validSociety } from "../../helpers/SocietyInputValidationHelper";
import { createSociety } from "../../services/societiesService";
import { retrieveUser } from "../../services/usersService";

type Props = StackScreenProps<SocietiesStackParamList, "Register Society">;

export default function RegisterScreen(props: Props) {
  const [createSoc, setCreateSoc] =
    useState<CreateSociety>(defaultCreateSociety);

  const [inputErrMsg, setInputErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const registerSociety = () => {
    // Add user to exec
    retrieveUser().then((user) => {
      const fullExec = createSoc.exec.slice();
      fullExec.push(user.name);
      const fullCreateSoc = { ...createSoc, exec: fullExec };

      if (validSociety(fullCreateSoc, setInputErrMsg, setShowAlertDialog)) {
        createSociety(fullCreateSoc).then(props.navigation.goBack);
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
      <StyledAlertDialog
        {...{ showAlertDialog, setShowAlertDialog, inputErrMsg }}
      />
    </ScreenView>
  );
}
