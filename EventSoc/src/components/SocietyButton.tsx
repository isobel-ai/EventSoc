import {
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  AvatarImage
} from "@gluestack-ui/themed";
import { Society } from "../models/Society";
import { memo } from "react";

interface Props {
  society: Society;
  onPress: () => void;
}

function SocietyButton(props: Props) {
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
          color="white"
          fontSize="$sm">
          {props.society.data.name}
        </AvatarFallbackText>
        {props.society.data.pictureUrl && (
          <AvatarImage
            source={{ uri: props.society.data.pictureUrl }}
            alt=""
          />
        )}
      </Avatar>
      <ButtonText
        numberOfLines={1}
        ellipsizeMode="tail">
        {props.society.data.name}
      </ButtonText>
    </Button>
  );
}

export default memo(SocietyButton);
