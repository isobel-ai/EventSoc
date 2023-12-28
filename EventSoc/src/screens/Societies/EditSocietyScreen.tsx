import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { useState } from "react";
import { Button, ButtonText } from "@gluestack-ui/themed";
import ErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useSocietiesContext } from "../../contexts/SocietiesContext";
import { CreateSociety } from "../../models/Society";
import SocietyForm from "../../components/SocietyForm";
import { validSociety } from "../../helpers/SocietyInputValidationHelper";
import { getSocietyUpdates } from "../../helpers/UpdateHelper";
import {
  retrieveSociety,
  updateSociety
} from "../../services/societiesService";

type Props = StackScreenProps<SocietiesStackParamList, "Edit Society">;

export default function EditSocietyScreen(props: Props) {
  const { selectedSoc, setSelectedSoc } = useSocietiesContext();

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
      const updateSoc = getSocietyUpdates(id, beforeSoc, afterSoc);
      updateSociety(updateSoc)
        .then(() => retrieveSociety(selectedSoc.id))
        .then((updatedSoc) => updatedSoc && setSelectedSoc(updatedSoc))
        .then(props.navigation.goBack);
    }
  };

  return (
    <ScreenView>
      <SocietyForm
        createSociety={afterSoc}
        setCreateSociety={setAfterSoc}
        editingForm
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={editSociety}>
        <ButtonText>Update</ButtonText>
      </Button>
      <ErrorAlertDialog {...{ showAlertDialog, setShowAlertDialog, errMsg }} />
    </ScreenView>
  );
}
