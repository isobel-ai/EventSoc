import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  Heading,
  Pressable
} from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import {
  useNavigation,
  NavigationProp,
  NavigatorScreenParams
} from "@react-navigation/native";
import { useAppContext } from "../contexts/AppContext";
import { SocietiesStackParamList } from "../navigation/Societies/SocietiesStackNavigator";

interface Props {
  societyId: string;
}

export default function SocietyPressable<
  NestedSocietiesStackParamList extends {
    Society: NavigatorScreenParams<SocietiesStackParamList>;
  }
>(props: Props) {
  const navigation = useNavigation<NavigationProp<SocietiesStackParamList>>();
  const nestedNavigation =
    useNavigation<NavigationProp<NestedSocietiesStackParamList>>();

  const { societies } = useAppContext();

  const society = societies.find((soc) => soc.id === props.societyId)?.data;

  return (
    <Pressable
      width="100%"
      backgroundColor={config.tokens.colors.coolGray200}
      paddingHorizontal={15}
      paddingVertical={5}
      onPress={() => {
        navigation.getId() === "Societies"
          ? navigation.navigate("Home", { societyId: props.societyId })
          : nestedNavigation.navigate("Society", {
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
