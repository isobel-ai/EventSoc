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
import ConfirmDialog from "../general/ConfirmDialog";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";
import { useOnDeleteEventContext } from "../../contexts/OnDeleteEventContext";
import { deleteEvent } from "../../services/event/eventsService";
import { config } from "../../../config/gluestack-ui.config";

type Props = {
  eventId: string;
};

export default function EventMenu(props: Props) {
  const { navigate } = useNavigation<NavigationProp<EventStackParamList>>();

  const { onDeleteEvent } = useOnDeleteEventContext();

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const handleDeleteEvent = () => {
    return deleteEvent(props.eventId).then(onDeleteEvent);
  };

  const menuSelectionHandler = (keys: Iterable<React.Key> | string) => {
    const keySet = new Set<React.Key>(keys);
    if (keySet.has("edit")) {
      navigate("Edit Event", { eventId: props.eventId });
    } else if (keySet.has("delete")) {
      setShowDeleteDialog(true);
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
                color={config.tokens.colors.black}
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
      <ConfirmDialog
        confirmFunc={handleDeleteEvent}
        heading="Delete Event?"
        body="Deleting an event cannot be undone."
        confirmText="Delete"
        isVisible={showDeleteDialog}
        setIsVisible={setShowDeleteDialog}
      />
    </>
  );
}
