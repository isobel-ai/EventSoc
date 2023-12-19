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
  CloseIcon
} from "@gluestack-ui/themed";
import { RetrieveSocEvent } from "../models/SocEvent";
import { config } from "../../config/gluestack-ui.config";
import { useSocietiesContext } from "../contexts/SocietiesContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SocietiesStackParamList } from "../navigation/Societies/SocietiesStackNavigator";
import { useState } from "react";
import { deleteEvent } from "../services/eventsService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  retrieveSocEvent: RetrieveSocEvent;
}

export default function EventListButton(props: Props) {
  const { setToEditEvent, setEventDeleted } = useSocietiesContext();

  const { navigate } = useNavigation<NavigationProp<SocietiesStackParamList>>();

  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const menuSelectionHandler = (keys: Iterable<React.Key> | string) => {
    const keySet = new Set<React.Key>(keys);
    if (keySet.has("edit")) {
      goToEditEventPage();
    } else if (keySet.has("delete")) {
      setShowAlertDialog(true);
    }
  };

  const goToEditEventPage = () => {
    setToEditEvent(props.retrieveSocEvent);
    navigate("Edit Event");
  };

  const deleteAndRefresh = () => {
    deleteEvent(
      props.retrieveSocEvent.id,
      props.retrieveSocEvent.pictureUrl
    ).then(() => setEventDeleted(true)); // Causes the page to refresh
  };

  return (
    <Button
      backgroundColor={config.tokens.colors.eventButtonGray}
      height={100}
      width={325}
      style={
        props.retrieveSocEvent.pictureUrl
          ? { justifyContent: "flex-start" }
          : {}
      }>
      {props.retrieveSocEvent.pictureUrl && (
        <Image
          size="md"
          source={props.retrieveSocEvent.pictureUrl}
          alt=""
          style={{ left: -10 }}
        />
      )}
      <ButtonText
        numberOfLines={2}
        ellipsizeMode="tail"
        lineBreakStrategyIOS="standard">
        {props.retrieveSocEvent.name}
      </ButtonText>
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
      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => {
          setShowAlertDialog(false);
        }}>
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
            <HStack style={{ flex: 1, justifyContent: "space-between" }}>
              <Button
                variant="outline"
                action="secondary"
                onPress={() => {
                  setShowAlertDialog(false);
                }}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={() => {
                  setShowAlertDialog(false);
                  deleteAndRefresh();
                }}>
                <ButtonText>Delete</ButtonText>
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Button>
  );
}
