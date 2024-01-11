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
  const { getUser, updateSocieties } = useAppContext();

  const [society, setSociety] = useState<SocietyData>(defaultSocietyData);

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const registerSociety = () => {
    // Add user to exec
    const userName = getUser()?.data.name;
    const fullExec = society.exec.slice();
    if (userName) {
      fullExec.push(userName);
    }
    const fullSoc = { ...society, exec: fullExec };

    const invalidErrMsg = getSocietyErrMsg(fullSoc);
    if (invalidErrMsg) {
      setErrMsg(invalidErrMsg);
      setShowAlertDialog(true);
    } else {
      createSociety(fullSoc)
        .then((socId) => {
          updateSocieties()
            .then(() => props.navigation.navigate("Home", { societyId: socId }))
            .catch();
        })
        .catch((err) => {
          setErrMsg(err.message);
          setShowAlertDialog(true);
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
      <ErrorAlertDialog {...{ showAlertDialog, setShowAlertDialog, errMsg }} />
    </ScreenView>
  );
}
