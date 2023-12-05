import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { ManageEventsStackParamList } from "../../navigation/ManageEventsStackNavigator";
import { CreateSocEvent } from "../../models/SocEvent";
import { useState } from "react";
import { validEvent } from "../../helpers/EventInputValidationHelper";
import EventForm from "../../components/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import CreateEventAlertDialog from "../../components/CreateEventAlertDialog";
import { useManageSocEventContext } from "../../contexts/ManageSocEventContext";
import { getEventUpdates } from "../../helpers/UpdateHelper";
import { updateEvent } from "../../services/eventsService";

type Props = StackScreenProps<ManageEventsStackParamList, "Edit Event">;

export default function EditEventScreen(props: Props) {
  const { toEditEvent } = useManageSocEventContext();

  const { id, ...socEvent } = toEditEvent;
  const beforeSocEvent = Object.assign(socEvent, {
    localPictureUrl: socEvent.pictureUrl
  });

  const [afterSocEvent, setAfterSocEvent] = useState<CreateSocEvent>({
    ...beforeSocEvent,
    startDate: new Date(beforeSocEvent.startDate),
    endDate: new Date(beforeSocEvent.endDate)
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
        createSocEvent={afterSocEvent}
        setCreateSocEvent={setAfterSocEvent}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={editEvent}>
        <ButtonText>Update</ButtonText>
      </Button>
      <CreateEventAlertDialog
        {...{ showAlertDialog, setShowAlertDialog, inputErrMsg }}
      />
    </ScreenView>
  );
}
