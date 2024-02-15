import ScreenView from "../../components/general/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import EventForm from "../../components/event/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import { getEventErrMsg } from "../../helpers/EventInputValidationHelper";
import { EventData, defaultEventData } from "../../../../Shared/models/Event";
import ErrorAlertDialog, {
  ErrDialogState,
  defaultErrDialogState
} from "../../components/error/ErrorAlertDialog";
import { SocietyStackParamList } from "../../navigation/CrossTabStackScreens/SocietyStackScreens";
import { createSocietyEvent } from "../../services/society/societyEventsService";

type Props = StackScreenProps<SocietyStackParamList, "Create Event">;

export default function CreateEventScreen(props: Props) {
  const [event, setEvent] = useState<EventData>(defaultEventData);

  const [image, setImage] = useState<string>("");

  const [errDialogState, setErrDialogState] = useState<ErrDialogState>(
    defaultErrDialogState
  );

  const handleCreateEvent = () => {
    const invalidErrMsg = getEventErrMsg(event);
    if (invalidErrMsg) {
      setErrDialogState({ message: invalidErrMsg, showDialog: true });
    } else {
      createSocietyEvent(props.route.params.organiserId, event, image)
        .then(props.navigation.goBack)
        .catch((err) => {
          console.error(err.message);
          setErrDialogState({
            message: "Couldn't create event. Try again later.",
            showDialog: true
          });
        });
    }
  };

  return (
    <ScreenView hasNavHeader>
      <EventForm {...{ event, setEvent, image, setImage }} />
      <Button
        size="xl"
        action={"positive"}
        borderRadius="$none"
        onPress={handleCreateEvent}>
        <ButtonText>Post</ButtonText>
      </Button>
      <ErrorAlertDialog {...{ errDialogState, setErrDialogState }} />
    </ScreenView>
  );
}
