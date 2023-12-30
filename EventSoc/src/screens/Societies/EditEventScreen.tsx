import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { CreateEvent } from "../../models/Event";
import { useState } from "react";
import { getEventErrMsg } from "../../helpers/EventInputValidationHelper";
import EventForm from "../../components/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import ErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useSocietiesContext } from "../../contexts/SocietiesContext";
import { getEventUpdates } from "../../helpers/UpdateHelper";
import { updateEvent } from "../../services/eventsService";

type Props = StackScreenProps<SocietiesStackParamList, "Edit Event">;

export default function EditEventScreen(props: Props) {
  const { toEditEvent } = useSocietiesContext();

  const { id, ...event } = toEditEvent;
  const beforeEvent = Object.assign(event, {
    localPictureUrl: event.pictureUrl
  });

  const [afterEvent, setAfterEvent] = useState<CreateEvent>({
    ...beforeEvent
  });

  const [errMsg, setErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const editEvent = () => {
    const invalidErrMsg = getEventErrMsg(afterEvent);
    if (invalidErrMsg) {
      setErrMsg(invalidErrMsg);
      setShowAlertDialog(true);
    } else {
      const eventUpdates = getEventUpdates(id, beforeEvent, afterEvent);
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
