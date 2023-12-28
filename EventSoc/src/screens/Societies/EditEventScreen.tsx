import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { CreateEvent } from "../../models/Event";
import { useState } from "react";
import { validEvent } from "../../helpers/EventInputValidationHelper";
import EventForm from "../../components/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import StyledAlertDialog from "../../components/StyledAlertDialog";
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

  const [inputErrMsg, setInputErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const editEvent = () => {
    if (validEvent(afterSocEvent, setInputErrMsg, setShowAlertDialog)) {
      const updateSocEvent = getEventUpdates(id, beforeSocEvent, afterSocEvent);
      updateEvent(updateSocEvent).then(props.navigation.goBack);
    }
  };

  return (
    <ScreenView>
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
      <StyledAlertDialog
        {...{ showAlertDialog, setShowAlertDialog, inputErrMsg }}
      />
    </ScreenView>
  );
}
