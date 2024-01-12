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

  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteEventDialog(props: Props) {
  const { updateSocieties } = useAppContext();

  const [deleteErrorMsg, setDeleteErrorMsg] = useState<string>("");

  const handleDialogClose = () => {
    props.setIsVisible(false);
    setDeleteErrorMsg("");
  };

  const handleDeleteEvent = () => {
    deleteSocEvent(
      props.event.id,
      props.event.data.pictureUrl,
      props.event.data.organiserId
    )
      .then(() => updateSocieties().catch())
      .then(handleDialogClose)
      .catch((err) => {
        setDeleteErrorMsg(err.message);
      });
  };

  return (
    <AlertDialog
      isOpen={props.isVisible}
      onClose={handleDialogClose}>
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
                onPress={handleDialogClose}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={handleDeleteEvent}>
                <ButtonText>Delete</ButtonText>
              </Button>
            </HStack>
            {deleteErrorMsg && (
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
                <AlertText>{deleteErrorMsg}</AlertText>
              </Alert>
            )}
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
