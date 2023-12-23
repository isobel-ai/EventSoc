import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { useState } from "react";
import { Button, ButtonText } from "@gluestack-ui/themed";
import StyledAlertDialog from "../../components/StyledAlertDialog";
import { useSocietiesContext } from "../../contexts/SocietiesContext";
import { CreateSociety } from "../../models/Society";
import SocietyForm from "../../components/SocietyForm";
import { validSociety } from "../../helpers/SocietyInputValidationHelper";

type Props = StackScreenProps<SocietiesStackParamList, "Edit Society">;

export default function EditSocietyScreen(props: Props) {
  const { selectedSoc } = useSocietiesContext();

  const { id, ...soc } = selectedSoc;
  const beforeSoc = Object.assign(soc, {
    localPictureUrl: soc.pictureUrl
  });

  const [afterSoc, setAfterSoc] = useState<CreateSociety>({
    ...beforeSoc
  });

  const [inputErrMsg, setInputErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const editSociety = () => {
    if (validSociety(afterSoc, setInputErrMsg, setShowAlertDialog)) {
      //done - const updateSoc = getSocietyUpdates(id, beforeSoc, afterSoc);
      //todo - updateSociety(updateSoc).then(props.navigation.goBack);
    }
  };

  return (
    <ScreenView>
      <SocietyForm
        createSociety={afterSoc}
        setCreateSociety={setAfterSoc}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={editSociety}>
        <ButtonText>Update</ButtonText>
      </Button>
      <StyledAlertDialog
        {...{ showAlertDialog, setShowAlertDialog, inputErrMsg }}
      />
    </ScreenView>
  );
}
