import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import EventForm from "../../components/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import { CreateEvent, defaultCreateEvent } from "../../models/Event";
import { useSocietiesContext } from "../../contexts/SocietiesContext";
import { addSocEvent } from "../../services/societiesService";

type Props = StackScreenProps<SocietiesStackParamList, "Create Event">;

export default function CreateEventScreen(props: Props) {
  const { selectedSoc } = useSocietiesContext();

  const [createEvent, setCreateEvent] = useState<CreateEvent>(
    defaultCreateEvent()
  );

  const [inputErrMsg, setInputErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const postEvent = () => {
    if (validEvent(createSocEvent, setInputErrMsg, setShowAlertDialog)) {
      createEvent(createSocEvent)
        .then((eventRef) => eventRef && addSocEvent(selectedSoc.id, eventRef))
        .then(props.navigation.goBack);
    }
  };

  return (
    <ScreenView>
      <EventForm
        createEvent={createEvent}
        setCreateEvent={setCreateEvent}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={postEvent}>
        <ButtonText>Post</ButtonText>
      </Button>
      <StyledAlertDialog
        {...{ showAlertDialog, setShowAlertDialog, inputErrMsg }}
      />
    </ScreenView>
  );
}
