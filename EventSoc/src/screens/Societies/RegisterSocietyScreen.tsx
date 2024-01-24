import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import ErrorAlertDialog from "../../components/ErrorAlertDialog";
import { SocietyData, defaultSocietyData } from "../../models/Society";
import SocietyForm from "../../components/SocietyForm";
import { getSocietyErrMsg } from "../../helpers/SocietyInputValidationHelper";
import { createSociety } from "../../services/societiesService";
import { useAppContext } from "../../contexts/AppContext";

type Props = StackScreenProps<SocietiesStackParamList, "Register Society">;

export default function RegisterScreen(props: Props) {
  const { userId } = useAppContext();

  const [society, setSociety] = useState<SocietyData>(defaultSocietyData);

  const [registerErrMsg, setRegisterErrMsg] = useState<string>("");
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);

  const registerSociety = () => {
    // Add user to exec
    const fullExec = society.execIds.slice();
    fullExec.push(userId);
    const fullSoc = { ...society, exec: fullExec };

    const invalidErrMsg = getSocietyErrMsg(fullSoc);
    if (invalidErrMsg) {
      setRegisterErrMsg(invalidErrMsg);
      setShowErrorDialog(true);
    } else {
      createSociety(fullSoc)
        .then((socId) =>
          props.navigation.navigate("Home", { societyId: socId })
        )
        .catch((err) => {
          setRegisterErrMsg(err.message);
          setShowErrorDialog(true);
        });
    }
  };

  return (
    <ScreenView hasNavHeader>
      <SocietyForm
        society={society}
        setSociety={setSociety}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={registerSociety}>
        <ButtonText>Register</ButtonText>
      </Button>
      <ErrorAlertDialog
        isVisible={showErrorDialog}
        setIsVisible={setShowErrorDialog}
        errMsg={registerErrMsg}
      />
    </ScreenView>
  );
}
