import {
  Button,
  Menu,
  ButtonIcon,
  ThreeDotsIcon,
  MenuItem,
  Icon,
  DownloadIcon,
  MenuItemLabel,
  TrashIcon
} from "@gluestack-ui/themed";
import { useState } from "react";
import DeleteEventDialog from "./DeleteEventDialog";
import { Event } from "../models/Event";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SocietiesStackParamList } from "../navigation/Societies/SocietiesStackNavigator";
import { EventsStackParamList } from "../navigation/EventsStackNavigator";

interface Props {
  event: Event;
}

export default function EventMenu(props: Props) {
  const { navigate } =
    useNavigation<
      NavigationProp<SocietiesStackParamList | EventsStackParamList>
    >();

  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const menuSelectionHandler = (keys: Iterable<React.Key> | string) => {
    const keySet = new Set<React.Key>(keys);
    if (keySet.has("edit")) {
      navigate("Edit Event", { eventId: props.event.id });
    } else if (keySet.has("delete")) {
      setShowAlertDialog(true);
    }
  };

  return (
    <>
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
        {props.event.data.startDate > new Date() && (
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
        )}
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
      <DeleteEventDialog
        event={props.event}
        {...{ showAlertDialog, setShowAlertDialog }}
      />
    </>
  );
}
