import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
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
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";

type Props = StackScreenProps<EventStackParamList, "Edit Event">;

export default function EditEventScreen(props: Props) {
  const { events } = useAppContext();

  const toEditEvent = events.find(
    (event) => event.id === props.route.params.eventId
  )?.data;

  const [editEventErrMsg, setEditEventErrMsg] = useState<string>(
    toEditEvent ? "" : "Could not retrieve event details. Try again later."
  );
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(
    toEditEvent === undefined
  );

  const beforeEvent = toEditEvent ?? defaultEventData();
  const [afterEvent, setAfterEvent] = useState<EventData>(
    cloneDeep(beforeEvent)
  );

  const editEvent = () => {
    const invalidErrMsg = getEventErrMsg(afterEvent);
    if (invalidErrMsg) {
      setEditEventErrMsg(invalidErrMsg);
      setShowErrorDialog(true);
    } else {
      const eventUpdates = getUpdates(beforeEvent, afterEvent);
      updateEvent(eventUpdates, props.route.params.eventId)
        .then(props.navigation.goBack)
        .catch((err) => {
          setEditEventErrMsg(err.message);
          setShowErrorDialog(true);
        });
    }
  };

  return (
    <ScreenView hasNavHeader>
      {toEditEvent && (
        <>
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
        </>
      )}
      <ErrorAlertDialog
        isVisible={showErrorDialog}
        setIsVisible={setShowErrorDialog}
        errMsg={editEventErrMsg}
        onClose={!toEditEvent ? props.navigation.goBack : undefined}
      />
    </ScreenView>
  );
}
