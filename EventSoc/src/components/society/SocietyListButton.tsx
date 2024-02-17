import {
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  AvatarImage
} from "@gluestack-ui/themed";
import { Name } from "../../../../Shared/models/Name";
import { useEffect, useState } from "react";
import { retrieveSocietyImage } from "../../services/society/societiesService";
import { config } from "../../../config/gluestack-ui.config";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  society: Name;
  onPress?: () => void;
  imageReloadTrigger?: boolean;
};

export default function SocietyListButton(props: Props) {
  const [image, setImage] = useState<string>();

  const triggerReload = props.imageReloadTrigger ?? useIsFocused();

  useEffect(() => {
    triggerReload &&
      retrieveSocietyImage(props.society.id)
        .then(setImage)
        .catch((err) => console.error(err.message));
  }, [triggerReload]);

  return (
    <Button
      key={props.society.id}
      variant="link"
      sx={{
        ":active": { _text: { textDecorationLine: "none" } }
      }}
      size="lg"
      width="100%"
      marginVertical={5}
      justifyContent="flex-start"
      onPress={props.onPress}>
      <Avatar marginHorizontal={10}>
        <AvatarFallbackText
          color={config.tokens.colors.white}
          fontSize="$sm">
          {props.society.name}
        </AvatarFallbackText>
        {image && (
          <AvatarImage
            source={{ uri: image }}
            alt=""
          />
        )}
      </Avatar>
      <ButtonText
        numberOfLines={1}
        ellipsizeMode="tail">
        {props.society.name}
      </ButtonText>
    </Button>
  );
}
