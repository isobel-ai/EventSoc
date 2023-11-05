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
  TrashIcon
} from "@gluestack-ui/themed";
import SocEvent from "../models/SocEvent";
import { useEffect, useState } from "react";
import { getEventPicture } from "../services/eventsService";
import { config } from "../../config/gluestack-ui.config";

interface Props {
  event: SocEvent;
}

export default function EventListButton(props: Props) {
  const [img, setImg] = useState<string>("");

  useEffect(() => {
    props.event.pictureURL && getEventPicture(props.event.pictureURL, setImg);
  }, []);

  return (
    <Button
      backgroundColor={config.tokens.colors.eventButtonGray}
      height={100}
      width={325}>
      {img && (
        <Image
          size="md"
          source={img}
          alt=""
          style={{ position: "absolute", left: 10 }}
        />
      )}
      <ButtonText>{props.event.name}</ButtonText>
      <Menu
        placement="bottom right"
        trigger={({ ...triggerProps }) => {
          return (
            <Button
              style={{ position: "absolute", right: 10, top: 5 }}
              {...triggerProps}
              variant="link">
              <ButtonIcon
                as={ThreeDotsIcon}
                size="xl"
              />
            </Button>
          );
        }}>
        <MenuItem textValue="Edit Event">
          <Icon
            as={DownloadIcon}
            size="xl"
            mr="$5"
          />
          <MenuItemLabel size="sm">Edit Event</MenuItemLabel>
        </MenuItem>
        <MenuItem textValue="Delete Event">
          <Icon
            as={TrashIcon}
            size="xl"
            mr="$5"
          />
          <MenuItemLabel size="sm">Delete Event</MenuItemLabel>
        </MenuItem>
      </Menu>
    </Button>
  );
}
