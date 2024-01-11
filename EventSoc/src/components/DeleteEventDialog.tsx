import {
  Button,
  Alert,
  Icon,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  HStack,
  Heading,
  AlertDialogCloseButton,
  CloseIcon,
  AlertDialogBody,
  AlertDialogFooter,
  VStack,
  ButtonText,
  AlertText,
  Text
} from "@gluestack-ui/themed";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../config/gluestack-ui.config";
import { deleteSocEvent } from "../services/socEventsService";
import { Event } from "../models/Event";
import { useAppContext } from "../contexts/AppContext";

interface Props {
  event: Event;
  showAlertDialog: boolean;
  setShowAlertDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteEventDialog(props: Props) {
  const { updateSocietyInContext } = useAppContext();

  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleAlertDialogClose = () => {
    props.setShowAlertDialog(false);
    setErrorMsg("");
  };

  const handleDeleteEvent = () => {
    deleteSocEvent(
      props.event.id,
      props.event.data.pictureUrl,
      props.event.data.organiserId
    )
      .then(() => updateSocietyInContext(props.event.data.organiserId))
      .then(handleAlertDialogClose)
      .catch((err) => {
        setErrorMsg(err.message);
      });
  };

  return (
    <AlertDialog
      isOpen={props.showAlertDialog}
      onClose={handleAlertDialogClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <HStack style={{ gap: 10 }}>
            <MaterialIcons
              name="warning"
              size={40}
              color={config.tokens.colors.warningYellow}
            />
            <Heading size="lg">{"Delete Event?"}</Heading>
          </HStack>
          <AlertDialogCloseButton>
            <Icon
              as={CloseIcon}
              size="xl"
            />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="md">Deleting an event cannot be undone.</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <VStack
            width="100%"
            gap={15}>
            <HStack gap={55}>
              <Button
                variant="outline"
                action="secondary"
                onPress={handleAlertDialogClose}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={handleDeleteEvent}>
                <ButtonText>Delete</ButtonText>
              </Button>
            </HStack>
            {errorMsg && (
              <Alert
                action="error"
                variant="outline"
                width="95%">
                <MaterialIcons
                  name="error-outline"
                  size={40}
                  color={config.tokens.colors.error}
                  style={{ paddingRight: 15 }}
                />
                <AlertText>{errorMsg}</AlertText>
              </Alert>
            )}
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
