import {
  Button,
  ButtonIcon,
  ButtonText,
  Image,
  ThreeDotsIcon,
  Menu,
  DownloadIcon,
  MenuItem,
  Icon,
  MenuItemLabel,
  TrashIcon,
  HStack,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  Heading,
  AlertDialogBody,
  Text,
  AlertDialogCloseButton,
  AlertDialogFooter,
  CloseIcon,
  Alert,
  AlertText,
  VStack
} from "@gluestack-ui/themed";
import { Event } from "../models/Event";
import { config } from "../../config/gluestack-ui.config";
import { useAppContext } from "../contexts/AppContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SocietiesStackParamList } from "../navigation/Societies/SocietiesStackNavigator";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { deleteSocEvent } from "../services/socEventsService";

interface Props {
  event: Event;
  isExec: boolean;
  setEventDeleted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EventListButton(props: Props) {
  const { updateSocietyInContext } = useAppContext();

  const { navigate } = useNavigation<NavigationProp<SocietiesStackParamList>>();

  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>("");

  const menuSelectionHandler = (keys: Iterable<React.Key> | string) => {
    const keySet = new Set<React.Key>(keys);
    if (keySet.has("edit")) {
      goToEditEventPage();
    } else if (keySet.has("delete")) {
      setShowAlertDialog(true);
    }
  };

  const goToEditEventPage = () => {
    navigate("Edit Event", { eventId: props.event.id });
  };

  const handleAlertDialogClose = () => {
    setShowAlertDialog(false);
    setErrorMsg("");
  };

  const deleteAndRefresh = () => {
    deleteSocEvent(
      props.event.id,
      props.event.data.pictureUrl,
    ).then((result) => {
        if (result instanceof Error) {
          setErrorMsg(result.message);
        } else {
        updateSocietyInContext(props.event.data.organiserId).then(() => {
              props.setEventDeleted(true); // Causes the page to refresh
              handleAlertDialogClose();
        });
      }
    });
  };

  return (
    <Button
      onPress={() => navigate("Event", { eventId: props.event.id })}
      backgroundColor={config.tokens.colors.eventButtonGray}
      height={100}
      width="100%"
      alignSelf="center"
      borderRadius="$none">
      {props.event.data.pictureUrl && (
        <Image
          size="md"
          source={props.event.data.pictureUrl}
          alt=""
          style={{ position: "absolute", left: 10 }}
        />
      )}
      <ButtonText
        numberOfLines={2}
        ellipsizeMode="tail"
        lineBreakStrategyIOS="standard">
        {props.event.data.name}
      </ButtonText>
      {props.isExec && (
        <Menu
          placement="bottom right"
          selectionMode="single"
          onSelectionChange={menuSelectionHandler}
          trigger={({ ...triggerProps }) => {
            return (
              <Button
                style={{ position: "absolute", right: 10, top: -5 }}
                {...triggerProps}
                variant="link">
                <ButtonIcon
                  as={ThreeDotsIcon}
                  size="xl"
                />
              </Button>
            );
          }}>
          <MenuItem
            key="edit"
            textValue="Edit Event">
            <Icon
              as={DownloadIcon}
              size="xl"
              mr="$5"
            />
            <MenuItemLabel size="sm">Edit Event</MenuItemLabel>
          </MenuItem>
          <MenuItem
            key="delete"
            textValue="Delete Event">
            <Icon
              as={TrashIcon}
              size="xl"
              mr="$5"
            />
            <MenuItemLabel size="sm">Delete Event</MenuItemLabel>
          </MenuItem>
        </Menu>
      )}
      <AlertDialog
        isOpen={showAlertDialog}
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
                  onPress={deleteAndRefresh}>
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
    </Button>
  );
}
