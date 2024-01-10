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
import { getSocietyUpdates } from "../../helpers/UpdateHelper";
import { updateSociety } from "../../services/societiesService";
import { cloneDeep } from "lodash";

type Props = StackScreenProps<SocietiesStackParamList, "Edit Society">;

export default function EditSocietyScreen(props: Props) {
  const { societies, updateSocietyInContext } = useAppContext();

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const toEditSociety = societies.find(
    (soc) => soc.id === props.route.params.societyId
  );
  let beforeSoc = defaultCreateSociety();
  if (!toEditSociety) {
    setErrMsg("Could not retrieve society details. Try again later.");
    setShowAlertDialog(true);
  } else {
    const { id, ...soc } = toEditSociety;
    beforeSoc = Object.assign(soc, {
      localPictureUrl: soc.pictureUrl
    });
  }

  const beforeSoc = toEditSoc ?? defaultSocietyData();
  const [afterSoc, setAfterSoc] = useState<SocietyData>(cloneDeep(beforeSoc));

  const editSociety = () => {
    const invalidErrMsg = getSocietyErrMsg(afterSoc);
    if (invalidErrMsg) {
      setErrMsg(invalidErrMsg);
      setShowAlertDialog(true);
    } else {
      const updateSoc = getSocietyUpdates(
        props.route.params.societyId,
        beforeSoc,
        afterSoc
      );
      updateSociety(updateSoc).then((result) => {
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
