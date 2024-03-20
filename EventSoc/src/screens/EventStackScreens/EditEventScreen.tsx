import { Button, ButtonText, Spinner } from "@gluestack-ui/themed";
import { useIsFocused } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { cloneDeep, isUndefined } from "lodash";
import { useEffect, useState } from "react";
import { EventData } from "../../../../Shared/models/Event";
import ErrorAlertDialog, {
  ErrDialogState,
  defaultErrDialogState
} from "../../components/error/ErrorAlertDialog";
import EventForm from "../../components/event/EventForm";
import ScreenView from "../../components/general/ScreenView";
import { useUserContext } from "../../contexts/UserContext";
import { getEventErrMsg } from "../../helpers/EventInputValidationHelper";
import { getUpdates } from "../../helpers/UpdateHelper";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";
import {
  retrieveEventData,
  retrieveEventImage,
  updateEvent
} from "../../services/event/eventsService";
import useDismissableToast from "../../hooks/useDismissableToast";

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

  const showUpdateSuccess = useDismissableToast();

  const editEvent = () => {
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
      .then(() =>
        showUpdateSuccess({
          title: `${afterEvent.name} has been updated`,
          action: "success"
        })
      )
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
      {isEventUndefined ? (
        <Spinner
          size="large"
          marginVertical={10}
        />
      ) : (
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
