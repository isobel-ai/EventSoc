import ScreenView from "../../components/general/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Button, ButtonText } from "@gluestack-ui/themed";
import ErrorAlertDialog, {
  ErrDialogState,
  defaultErrDialogState
} from "../../components/error/ErrorAlertDialog";
import { SocietyData } from "../../../../Shared/models/Society";
import SocietyForm from "../../components/society/SocietyForm";
import { getSocietyErrMsg } from "../../helpers/SocietyInputValidationHelper";
import { cloneDeep, isUndefined } from "lodash";
import { getArrayUpdates, getUpdates } from "../../helpers/UpdateHelper";
import {
  retrieveSocietyData,
  retrieveSocietyImage,
  updateSociety
} from "../../services/society/societiesService";
import { UserOverview } from "../../../../Shared/models/User";
import { retrieveSocietyExec } from "../../services/society/societyExecService";
import { SocietyStackParamList } from "../../navigation/CrossTabStackScreens/SocietyStackScreens";
import { useIsFocused } from "@react-navigation/native";

type Props = StackScreenProps<SocietyStackParamList, "Edit Society">;

export default function EditSocietyScreen(props: Props) {
  const [beforeSociety, setBeforeSociety] = useState<SocietyData>();
  const [afterSociety, setAfterSociety] = useState<SocietyData>();

  const [beforeExec, setBeforeExec] = useState<UserOverview[]>();
  const [afterExec, setAfterExec] = useState<UserOverview[]>();

  const [beforeImage, setBeforeImage] = useState<string>();
  const [afterImage, setAfterImage] = useState<string>();

  const isSocietyUndefined =
    isUndefined(afterSociety) ||
    isUndefined(afterExec) ||
    isUndefined(afterImage);

  const [errDialogState, setErrDialogState] = useState<ErrDialogState>(
    defaultErrDialogState
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const handleError = (err: Error) => {
        console.error(err.message);
        setErrDialogState({
          message: "Society couldn't be retrieved. Try again later.",
          showDialog: true
        });
      };

      retrieveSocietyData(props.route.params.societyId)
        .then((beforeSoc) => {
          setBeforeSociety(beforeSoc);
          setAfterSociety(cloneDeep(beforeSoc));
        })
        .catch(handleError);

      retrieveSocietyExec(props.route.params.societyId)
        .then((exec) => {
          setBeforeExec(exec);
          setAfterExec(cloneDeep(exec));
        })
        .catch(handleError);

      retrieveSocietyImage(props.route.params.societyId)
        .then((url) => {
          setBeforeImage(url);
          setAfterImage(url);
        })
        .catch(handleError);
    }
  }, [isFocused]);

  const editSociety = () => {
    if (
      isUndefined(beforeSociety) ||
      isUndefined(beforeExec) ||
      isUndefined(beforeImage) ||
      isSocietyUndefined
    ) {
      return;
    }

    const invalidErrMsg = getSocietyErrMsg(afterSociety, afterExec);
    if (invalidErrMsg) {
      setErrDialogState({ message: invalidErrMsg, showDialog: true });
      return;
    }

    const socUpdates = getUpdates(beforeSociety, afterSociety);
    const execUpdates = getArrayUpdates(beforeExec, afterExec);
    updateSociety(
      props.route.params.societyId,
      socUpdates,
      execUpdates,
      beforeImage !== afterImage ? afterImage : undefined
    )
      .then((result) => {
        typeof result === "string"
          ? setErrDialogState({
              message: result,
              showDialog: true
            })
          : props.navigation.goBack();
      })
      .catch((err) => {
        console.error(err.message);
        setErrDialogState({
          message: "Unable to update event. Try again later.",
          showDialog: true
        });
      });
  };

  return (
    <ScreenView useTopPadding>
      {!isSocietyUndefined && (
        <>
          <SocietyForm
            society={afterSociety}
            setSociety={setAfterSociety}
            exec={afterExec}
            setExec={setAfterExec}
            image={afterImage}
            setImage={setAfterImage}
            editingForm
          />
          <Button
            size="xl"
            action="positive"
            placement="absoluteBottom"
            onPress={editSociety}>
            <ButtonText>Update</ButtonText>
          </Button>
        </>
      )}
      <ErrorAlertDialog
        errDialogState={errDialogState}
        setErrDialogState={setErrDialogState}
        onClose={isSocietyUndefined ? props.navigation.goBack : undefined}
      />
    </ScreenView>
  );
}
