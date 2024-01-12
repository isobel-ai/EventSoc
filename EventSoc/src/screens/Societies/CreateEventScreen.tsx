import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import EventForm from "../../components/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import { getEventErrMsg } from "../../helpers/EventInputValidationHelper";
import { EventData, defaultEventData } from "../../models/Event";
import ErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useAppContext } from "../../contexts/AppContext";
import { createSocEvent } from "../../services/socEventsService";

type Props = StackScreenProps<SocietiesStackParamList, "Create Event">;

export default function CreateEventScreen(props: Props) {
  const { updateSocieties } = useAppContext();

  const [event, setEvent] = useState<EventData>(defaultEventData());

  const [createEventErrMsg, setCreateEventErrMsg] = useState<string>("");
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);

  const createEvent = () => {
    const invalidErrMsg = getEventErrMsg(event);
    if (invalidErrMsg) {
      setCreateEventErrMsg(invalidErrMsg);
      setShowErrorDialog(true);
    } else {
      createSocEvent(event, props.route.params.organiserId)
        .then(() => updateSocieties().catch())
        .then(props.navigation.goBack)
        .catch((err) => {
          setCreateEventErrMsg(err.message);
          setShowErrorDialog(true);
        });
    }
  };

  return (
    <ScreenView hasNavHeader>
      <EventForm
        event={event}
        setEvent={setEvent}
      />
      <Button
        size="xl"
        action={"positive"}
        borderRadius="$none"
        onPress={createEvent}>
        <ButtonText>Post</ButtonText>
      </Button>
      <ErrorAlertDialog
        isVisible={showErrorDialog}
        setIsVisible={setShowErrorDialog}
        errMsg={createEventErrMsg}
      />
    </ScreenView>
  );
}
