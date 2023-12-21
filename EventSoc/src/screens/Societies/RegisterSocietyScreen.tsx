import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import CreateEventAlertDialog from "../../components/CreateEventAlertDialog";
import { CreateSociety, defaultCreateSociety } from "../../models/Society";
import SocietyForm from "../../components/SocietyForm";
import { validSociety } from "../../helpers/SocietyInputValidationHelper";

type Props = StackScreenProps<SocietiesStackParamList, "Register Society">;

export default function RegisterScreen(props: Props) {
  const [createSociety, setCreateSociety] =
    useState<CreateSociety>(defaultCreateSociety);

  const [inputErrMsg, setInputErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const registerSociety = () => {
    // add user to exec
    if (validSociety(createSociety, setInputErrMsg, setShowAlertDialog)) {
      //   createEvent(createSocEvent).then(props.navigation.goBack);
      props.navigation.canGoBack(); // remove when line above is implemented
    }
  };

  return (
    <ScreenView>
      <SocietyForm
        createSociety={createSociety}
        setCreateSociety={setCreateSociety}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={registerSociety}>
        <ButtonText>Register</ButtonText>
      </Button>
      <CreateEventAlertDialog
        {...{ showAlertDialog, setShowAlertDialog, inputErrMsg }}
      />
    </ScreenView>
  );
}
