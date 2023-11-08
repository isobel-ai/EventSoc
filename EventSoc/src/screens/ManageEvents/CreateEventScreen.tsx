import ScreenView from "../../components/ScreenView";
import { StackNavigationProp } from "@react-navigation/stack";
import { ManageEventsStackParamList } from "../../navigation/ManageEventsStackNavigator";
import EventForm from "../../components/EventForm";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonText,
  CloseIcon,
  HStack,
  Heading,
  Icon,
  Text
} from "@gluestack-ui/themed";
import { useState } from "react";
import { validateEvent } from "../../helpers/InputValidationHelper";
import { MaterialIcons } from "@expo/vector-icons";
import { config } from "../../../config/gluestack-ui.config";
import { CreateSocEvent, SocEvent } from "../../models/SocEvent";
import { createEvent } from "../../services/eventsService";

type Props = {
  navigation: StackNavigationProp<ManageEventsStackParamList>;
};

export default function CreateEventScreen(props: Props) {
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [inputErrMsg, setInputErrMsg] = useState<string>("");
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const validEvent = () => {
    const errMsg = validateEvent(name, startDate, endDate);
    setInputErrMsg(errMsg);

    const valid = errMsg ? false : true;
    setShowAlertDialog(!valid);
    return valid;
  };

  const postEvent = () => {
    const socEvent: SocEvent = {
      name: name,
      description: desc,
      startDate: startDate,
      endDate: endDate,
      hasPicture: Boolean(image)
    };
    const createSocEvent: CreateSocEvent = {
      socEvent: socEvent,
      pictureURL: image
    };
    createEvent(createSocEvent);
    props.navigation.goBack();
  };

  return (
    <ScreenView>
      <EventForm
        {...{
          image,
          setImage,
          setName,
          setDesc,
          startDate,
          setStartDate,
          endDate,
          setEndDate
        }}
      />
      <Button
        size="xl"
        action={"positive"}
        onPress={() => validEvent() && postEvent()}>
        <ButtonText>Post</ButtonText>
      </Button>
      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => {
          setShowAlertDialog(false);
        }}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <HStack style={{ gap: 20 }}>
              <MaterialIcons
                name="error-outline"
                size={40}
                color={config.tokens.colors.error}
                style={{ top: 5 }}
              />
              <Heading size="xl">Error</Heading>
            </HStack>
            <AlertDialogCloseButton>
              <Icon
                as={CloseIcon}
                size="xl"
              />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="md">{inputErrMsg}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowAlertDialog(false);
              }}>
              <ButtonText>OK</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScreenView>
  );
}
