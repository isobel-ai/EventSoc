import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  Heading,
  Pressable
} from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { RetrieveSociety } from "../models/Society";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SocietiesStackParamList } from "../navigation/Societies/SocietiesStackNavigator";
import { MainTabParamList } from "../navigation/MainTabNavigator";

interface Props {
  society: RetrieveSociety;
}

export default function SocietyPressable(props: Props) {
  const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();

  return (
    <Pressable
      width="100%"
      backgroundColor={config.tokens.colors.coolGray200}
      paddingHorizontal={15}
      paddingVertical={5}
      onPress={() =>
        navigate("Societies", {
          screen: "Home",
          params: { societyId: props.society.id }
        })
      }>
      <HStack
        gap={15}
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
    </Pressable>
  );
}
