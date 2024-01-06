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
import { EventsStackParamList } from "../navigation/EventsStackNavigator";

interface Props {
  society: RetrieveSociety;
}

export default function SocietyPressable(props: Props) {
  const navigation = useNavigation<NavigationProp<EventsStackParamList>>();

  return (
    <Pressable
      width="100%"
      backgroundColor={config.tokens.colors.coolGray200}
      paddingHorizontal={15}
      paddingVertical={5}
      onPress={() => {
        navigation.getId() !== "Societies" &&
          navigation.navigate("Society", {
            screen: "Home",
            params: { societyId: props.society.id }
          });
      }}>
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
