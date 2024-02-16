import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  Heading,
  Pressable
} from "@gluestack-ui/themed";
import { config } from "../../../config/gluestack-ui.config";
import { SocietyOverview } from "../../../../Shared/models/Society";
import { useEffect, useState } from "react";
import { retrieveSocietyImage } from "../../services/society/societiesService";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SocietyStackParamList } from "../../navigation/CrossTabStackScreens/SocietyStackScreens";

type Props = {
  socOverview: SocietyOverview;
};

export default function SocietyPressable(props: Props) {
  const { navigate } = useNavigation<NavigationProp<SocietyStackParamList>>();

  const [avatarImage, setAvatarImage] = useState<string>();

  useEffect(() => {
    retrieveSocietyImage(props.socOverview.id)
      .then(setAvatarImage)
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <Pressable
      width="100%"
      backgroundColor={config.tokens.colors.coolGray200}
      paddingHorizontal={15}
      paddingVertical={5}
      onPress={() => navigate("Society", { societyId: props.socOverview.id })}>
      <HStack
        gap={15}
        alignItems="center">
        <Avatar size="md">
          <AvatarFallbackText
            color={config.tokens.colors.white}
            fontSize="$lg">
            {props.socOverview.name}
          </AvatarFallbackText>
          {avatarImage && (
            <AvatarImage
              source={{ uri: avatarImage }}
              alt=""
            />
          )}
        </Avatar>
        <Heading
          fontSize="$xl"
          numberOfLines={1}>
          {props.socOverview.name}
        </Heading>
      </HStack>
    </Pressable>
  );
}
