import ScreenView from "../../components/ScreenView";
import { StackNavigationProp } from "@react-navigation/stack";
import { ManageEventsStackParamList } from "../../navigation/ManageEventsStackNavigator";
import EventForm from "../../components/EventForm";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useState } from "react";
import { validEvent } from "../../helpers/InputValidationHelper";
import { CreateSocEvent, defaultCreateSocEvent } from "../../models/SocEvent";
import { createEvent } from "../../services/eventsService";
import CreateEventAlertDialog from "../../components/CreateEventAlertDialog";

type Props = {
  navigation: StackNavigationProp<ManageEventsStackParamList>;
};

export default function CreateEventScreen(props: Props) {
  const [createSocEvent, setCreateSocEvent] = useState<CreateSocEvent>(
    defaultCreateSocEvent
  );

  const [inputErrMsg, setInputErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const postEvent = () => {
    if (validEvent(createSocEvent, setInputErrMsg, setShowAlertDialog)) {
      createEvent(createSocEvent).then(props.navigation.goBack);
    }
  };

  return (
    <ScreenView>
      <EventForm
        createSocEvent={createSocEvent}
        setCreateSocEvent={setCreateSocEvent}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={postEvent}>
        <ButtonText>Post</ButtonText>
      </Button>
      <CreateEventAlertDialog
        {...{ showAlertDialog, setShowAlertDialog, inputErrMsg }}
      />
    </ScreenView>
  );
}
