import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import EventForm from "../../components/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import { getEventErrMsg } from "../../helpers/EventInputValidationHelper";
import { CreateEvent, defaultCreateEvent } from "../../models/Event";
import ErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useSocietiesContext } from "../../contexts/SocietiesContext";
import { createSocEvent } from "../../services/socEventsService";

type Props = StackScreenProps<SocietiesStackParamList, "Create Event">;

export default function CreateEventScreen(props: Props) {
  const { updateSocietyInContext } = useSocietiesContext();

  const [createEvent, setCreateEvent] = useState<CreateEvent>(
    defaultCreateEvent()
  );

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const postEvent = () => {
    const invalidErrMsg = getEventErrMsg(createEvent);
    if (invalidErrMsg) {
      setErrMsg(invalidErrMsg);
      setShowAlertDialog(true);
    } else {
      createSocEvent(createEvent, props.route.params.organiserId).then(
        (result) => {
          if (result instanceof Error) {
            setErrMsg(result.message);
            setShowAlertDialog(true);
          } else {
            updateSocietyInContext(props.route.params.organiserId).then(
              props.navigation.goBack
            );
          }
        }
      );
    }
  };

  return (
    <ScreenView hasNavHeader>
      <EventForm
        createEvent={createEvent}
        setCreateEvent={setCreateEvent}
      />
      <Button
        size="xl"
        action={"positive"}
        borderRadius="$none"
        onPress={postEvent}>
        <ButtonText>Post</ButtonText>
      </Button>
      <ErrorAlertDialog {...{ showAlertDialog, setShowAlertDialog, errMsg }} />
    </ScreenView>
  );
}
