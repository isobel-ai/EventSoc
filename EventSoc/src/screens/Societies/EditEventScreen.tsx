import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { EventData, defaultEventData } from "../../models/Event";
import { useState } from "react";
import { getEventErrMsg } from "../../helpers/EventInputValidationHelper";
import EventForm from "../../components/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import ErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useAppContext } from "../../contexts/AppContext";
import { getUpdates } from "../../helpers/UpdateHelper";
import { updateEvent } from "../../services/eventsService";
import { cloneDeep } from "lodash";

type Props = StackScreenProps<SocietiesStackParamList, "Edit Event">;

export default function EditEventScreen(props: Props) {
  const { events } = useAppContext();

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const toEditEvent = events.find(
    (event) => event.id === props.route.params.eventId
  )?.data;
  if (!toEditEvent) {
    setErrMsg("Could not retrieve event details. Try again later.");
    setShowAlertDialog(true);
  }

  const beforeEvent = toEditEvent ?? defaultEventData();
  const [afterEvent, setAfterEvent] = useState<EventData>(
    cloneDeep(beforeEvent)
  );

  const editEvent = () => {
    const invalidErrMsg = getEventErrMsg(afterEvent);
    if (invalidErrMsg) {
      setErrMsg(invalidErrMsg);
      setShowAlertDialog(true);
    } else {
      const eventUpdates = getUpdates(beforeEvent, afterEvent);
      updateEvent(eventUpdates, props.route.params.eventId)
        .then(props.navigation.goBack)
        .catch((err) => {
          setErrMsg(err.message);
          setShowAlertDialog(true);
        });
    }
  };

  return (
    <ScreenView hasNavHeader>
      <EventForm
        event={afterEvent}
        setEvent={setAfterEvent}
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
