import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  Heading
} from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { Society } from "../models/Society";

interface Props {
  society: Society;
}

export default function SocietyLabel(props: Props) {
  return (
    <HStack
      backgroundColor={config.tokens.colors.coolGray200}
      gap={15}
      width="100%"
      paddingHorizontal={15}
      paddingVertical={5}
      alignItems="center">
      <Avatar size="md">
        <AvatarFallbackText
          color="white"
          fontSize="$lg">
          {props.society.name}
        </AvatarFallbackText>
        {props.society.pictureUrl && (
          <AvatarImage
            source={{ uri: props.society.pictureUrl }}
            alt=""
          />
        )}
      </Avatar>
      <Heading
        fontSize="$xl"
        numberOfLines={1}>
        {props.society.name}
      </Heading>
    </HStack>
  );
}
