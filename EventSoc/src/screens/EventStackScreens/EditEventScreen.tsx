import ScreenView from "../../components/general/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { EventData } from "../../../../Shared/models/Event";
import { useEffect, useState } from "react";
import { getEventErrMsg } from "../../helpers/EventInputValidationHelper";
import EventForm from "../../components/event/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import ErrorAlertDialog, {
  ErrDialogState,
  defaultErrDialogState
} from "../../components/error/ErrorAlertDialog";
import { getUpdates } from "../../helpers/UpdateHelper";
import {
  retrieveEventData,
  retrieveEventImage,
  updateEvent
} from "../../services/event/eventsService";
import { cloneDeep, isUndefined } from "lodash";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";
import { useIsFocused } from "@react-navigation/native";
import { useUserContext } from "../../contexts/UserContext";

type Props = StackScreenProps<EventStackParamList, "Edit Event">;

export default function EditEventScreen(props: Props) {
  const { userId } = useUserContext();

  const [beforeEvent, setBeforeEvent] = useState<EventData>();
  const [afterEvent, setAfterEvent] = useState<EventData>();

  const [beforeImage, setBeforeImage] = useState<string>();
  const [afterImage, setAfterImage] = useState<string>();

  const isEventUndefined = isUndefined(afterEvent) || isUndefined(afterImage);

  const [errDialogState, setErrDialogState] = useState<ErrDialogState>(
    defaultErrDialogState
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const handleError = (err: Error) => {
        console.error(err.message);
        setErrDialogState({
          message: "Could not retrieve event details. Try again later.",
          showDialog: true
        });
      };

      retrieveEventData(props.route.params.eventId)
        .then((event) => {
          setBeforeEvent(event);
          setAfterEvent(cloneDeep(event));
        })
        .catch(handleError);

      retrieveEventImage(props.route.params.eventId)
        .then((url) => {
          setBeforeImage(url);
          setAfterImage(url);
        })
        .catch(handleError);
    }
  }, [isFocused]);

  const editEvent = async () => {
    if (
      isUndefined(beforeEvent) ||
      isUndefined(beforeImage) ||
      isEventUndefined
    ) {
      return;
    }

    const invalidErrMsg = getEventErrMsg(afterEvent);
    if (invalidErrMsg) {
      setErrDialogState({ message: invalidErrMsg, showDialog: true });
      return;
    }

    const eventUpdates = getUpdates(beforeEvent, afterEvent);

    if (
      !isUndefined(eventUpdates.capacity) &&
      eventUpdates.capacity < beforeEvent.attendance
    ) {
      setErrDialogState({
        message:
          "Updated capacity must not be smaller than number of sign-ups.",
        showDialog: true
      });
      return;
    }

    updateEvent(
      props.route.params.eventId,
      eventUpdates,
      afterEvent.organiser.id,
      userId,
      beforeImage !== afterImage ? afterImage : undefined
    )
      .then(props.navigation.goBack)
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
      {!isEventUndefined && (
        <>
          <EventForm
            event={afterEvent}
            setEvent={setAfterEvent}
            image={afterImage}
            setImage={setAfterImage}
          />
          <Button
            size="xl"
            action="positive"
            placement="absoluteBottom"
            onPress={editEvent}>
            <ButtonText>Update</ButtonText>
          </Button>
        </>
      )}
      <ErrorAlertDialog
        errDialogState={errDialogState}
        setErrDialogState={setErrDialogState}
        onClose={isEventUndefined ? props.navigation.goBack : undefined}
      />
    </ScreenView>
  );
}
