import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { CreateEvent, defaultCreateEvent } from "../../models/Event";
import { useState } from "react";
import { getEventErrMsg } from "../../helpers/EventInputValidationHelper";
import EventForm from "../../components/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import ErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useSocietiesContext } from "../../contexts/SocietiesContext";
import { getEventUpdates } from "../../helpers/UpdateHelper";
import { updateEvent } from "../../services/eventsService";
import { cloneDeep } from "lodash";

type Props = StackScreenProps<SocietiesStackParamList, "Edit Event">;

export default function EditEventScreen(props: Props) {
  const { societyEvents } = useSocietiesContext();

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const toEditEvent = societyEvents.find(
    (event) => event.id === props.route.params.eventId
  );
  let beforeEvent = defaultCreateEvent();
  if (!toEditEvent) {
    setErrMsg("Could not retrieve event details. Try again later.");
    setShowAlertDialog(true);
  } else {
    const { id, ...event } = toEditEvent;
    beforeEvent = Object.assign(event, {
      localPictureUrl: event.pictureUrl
    });
  }

  const [afterEvent, setAfterEvent] = useState<CreateEvent>(
    cloneDeep(beforeEvent)
  );

  const editEvent = () => {
    const invalidErrMsg = getEventErrMsg(afterEvent);
    if (invalidErrMsg) {
      setErrMsg(invalidErrMsg);
      setShowAlertDialog(true);
    } else {
      const eventUpdates = getEventUpdates(
        props.route.params.eventId,
        beforeEvent,
        afterEvent
      );
      updateEvent(eventUpdates).then((result) => {
        if (result instanceof Error) {
          setErrMsg(result.message);
          setShowAlertDialog(true);
        } else {
          props.navigation.goBack();
        }
      });
    }
  };

  return (
    <ScreenView hasNavHeader>
      <EventForm
        createEvent={afterEvent}
        setCreateEvent={setAfterEvent}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={editEvent}>
        <ButtonText>Update</ButtonText>
      </Button>
      <ErrorAlertDialog {...{ showAlertDialog, setShowAlertDialog, errMsg }} />
    </ScreenView>
  );
}
