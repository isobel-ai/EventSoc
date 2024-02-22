import {
  ThreeDotsIcon,
  Icon,
  DownloadIcon,
  TrashIcon,
  Divider,
  HStack,
  Text
} from "@gluestack-ui/themed";
import { useState } from "react";
import ConfirmDialog from "../general/ConfirmDialog";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";
import { useOnDeleteEventContext } from "../../contexts/OnDeleteEventContext";
import { deleteEvent } from "../../services/event/eventsService";
import { config } from "../../../config/gluestack-ui.config";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger
} from "react-native-popup-menu";

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

  return (
    <>
      <Menu style={{ position: "absolute", right: 5, top: 0 }}>
        <MenuTrigger>
          <Icon
            as={ThreeDotsIcon}
            size="xl"
            color={config.tokens.colors.black}
          />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              marginTop: 20,
              width: "50%",
              borderWidth: 1,
              borderRadius: 0,
              backgroundColor: config.tokens.colors.backgroundLight100
            }
          }}>
          <MenuOption
            onSelect={() => navigate("Edit Event", { eventId: props.eventId })}>
            <HStack
              alignItems="center"
              gap={5}>
              <Icon
                as={DownloadIcon}
                size="xl"
                mr="$5"
              />
              <Text size="sm">Edit Event</Text>
            </HStack>
          </MenuOption>
          <Divider bgColor={config.tokens.colors.black} />
          <MenuOption onSelect={() => setShowDeleteDialog(true)}>
            <HStack
              alignItems="center"
              gap={5}>
              <Icon
                as={TrashIcon}
                size="xl"
                mr="$5"
              />
              <Text size="sm">Delete Event</Text>
            </HStack>
          </MenuOption>
        </MenuOptions>
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
