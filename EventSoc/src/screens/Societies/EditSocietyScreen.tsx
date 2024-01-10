import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { useState } from "react";
import { Button, ButtonText } from "@gluestack-ui/themed";
import ErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useAppContext } from "../../contexts/AppContext";
import { SocietyData, defaultSocietyData } from "../../models/Society";
import SocietyForm from "../../components/SocietyForm";
import { getSocietyErrMsg } from "../../helpers/SocietyInputValidationHelper";
import { cloneDeep } from "lodash";
import { getUpdates } from "../../helpers/UpdateHelper";
import { updateSociety } from "../../services/societiesService";

type Props = StackScreenProps<SocietiesStackParamList, "Edit Society">;

export default function EditSocietyScreen(props: Props) {
  const { societies, updateSocietyInContext } = useAppContext();

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const toEditSoc = societies.find(
    (soc) => soc.id === props.route.params.societyId
  )?.data;
  if (!toEditSoc) {
    setErrMsg("Could not retrieve society details. Try again later.");
    setShowAlertDialog(true);
  } else {
  }

  const beforeSoc = toEditSoc ?? defaultSocietyData();
  const [afterSoc, setAfterSoc] = useState<SocietyData>(cloneDeep(beforeSoc));

  const editSociety = () => {
    const invalidErrMsg = getSocietyErrMsg(afterSoc);
    if (invalidErrMsg) {
      setErrMsg(invalidErrMsg);
      setShowAlertDialog(true);
    } else {
      const socUpdates = getUpdates(beforeSoc, afterSoc);
      updateSociety(socUpdates, props.route.params.societyId).then((result) => {
        if (result instanceof Error) {
          setErrMsg(result.message);
          setShowAlertDialog(true);
        } else {
          updateSocietyInContext(props.route.params.societyId).then(
            props.navigation.goBack
          );
        }
      });
    }
  };

  return (
    <ScreenView hasNavHeader>
      <SocietyForm
        society={afterSoc}
        setSociety={setAfterSoc}
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
