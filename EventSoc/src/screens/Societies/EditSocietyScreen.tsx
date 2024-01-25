import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { useEffect, useState } from "react";
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
  const { societies } = useAppContext();

  const toEditSoc = societies.find(
    (soc) => soc.id === props.route.params.societyId
  )?.data;

  const [editSocErrMsg, setEditSocErrMsg] = useState<string>(
    toEditSoc ? "" : "Could not retrieve society details. Try again later."
  );
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(
    toEditSoc === undefined
  );

  const beforeSoc = toEditSoc ?? defaultSocietyData();
  const [afterSoc, setAfterSoc] = useState<SocietyData>(cloneDeep(beforeSoc));

  const editSociety = () => {
    const invalidErrMsg = getSocietyErrMsg(afterSoc);
    if (invalidErrMsg) {
      setEditSocErrMsg(invalidErrMsg);
      setShowErrorDialog(true);
    } else {
      const socUpdates = getUpdates(beforeSoc, afterSoc);
      updateSociety(socUpdates, props.route.params.societyId)
        .then(props.navigation.goBack)
        .catch((err) => {
          setEditSocErrMsg(err.message);
          setShowErrorDialog(true);
        });
    }
  };

  return (
    <ScreenView hasNavHeader>
      {toEditSoc && (
        <>
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
        </>
      )}
      <ErrorAlertDialog
        isVisible={showErrorDialog}
        setIsVisible={setShowErrorDialog}
        errMsg={editSocErrMsg}
        onClose={!toEditSoc ? props.navigation.goBack : undefined}
      />
    </ScreenView>
  );
}
