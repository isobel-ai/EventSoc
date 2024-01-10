import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  Heading,
  Pressable
} from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { EventsStackParamList } from "../navigation/EventsStackNavigator";
import { useAppContext } from "../contexts/AppContext";

interface Props {
  societyId: string;
}

export default function SocietyPressable(props: Props) {
  const navigation = useNavigation<NavigationProp<EventsStackParamList>>();

  const { societies } = useAppContext();

  const society = societies.find((soc) => soc.id === props.societyId)?.data;

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
            params: { societyId: props.societyId }
          });
      }}>
      <HStack
        gap={15}
        alignItems="center">
        <Avatar size="md">
          <AvatarFallbackText
            color="white"
            fontSize="$lg">
            {society?.name}
          </AvatarFallbackText>
          {society?.pictureUrl && (
            <AvatarImage
              source={{ uri: society.pictureUrl }}
              alt=""
            />
          )}
        </Avatar>
        <Heading
          fontSize="$xl"
          numberOfLines={1}>
          {society?.name}
        </Heading>
      </HStack>
    </Pressable>
  );
}
