import {
  CalendarDaysIcon,
  HStack,
  Heading,
  Icon,
  Image,
  Pressable,
  Text,
  VStack
} from "@gluestack-ui/themed";
import SocietyPressable from "./SocietyPressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { toDateTimeRangeString } from "../helpers/DateTimeHelper";
import { StyleProp, ViewStyle } from "react-native";
import { EventData } from "../models/Event";

interface Props {
  event: EventData;
  onPress?: () => void;
}

export default function EventPost(props: Props) {
  const iconTextContainerStyle: StyleProp<ViewStyle> = {
    width: "90%",
    gap: 5,
    alignItems: "center"
  };

  return (
    <VStack
      gap={10}
      paddingBottom={10}>
      <SocietyPressable societyId={props.event.organiserId} />
      <Pressable onPress={props.onPress}>
        <VStack
          gap={10}
          width="100%">
          <VStack
            marginHorizontal={5}
            alignItems="flex-start"
            gap={5}>
            <Heading>{props.event.name}</Heading>
            <HStack style={iconTextContainerStyle}>
              <Icon
                as={CalendarDaysIcon}
                size="lg"
              />
              <Text>
                {toDateTimeRangeString(
                  props.event.startDate,
                  props.event.endDate
                )}
              </Text>
            </HStack>
            <HStack style={iconTextContainerStyle}>
              <MaterialIcons
                name="location-on"
                size={23}
                color="black"
              />
              <Text>{props.event.location}</Text>
            </HStack>
          </VStack>
          {props.event.pictureUrl && (
            <Image
              size="2xl"
              source={props.event.pictureUrl}
              alt=""
            />
          )}
        </VStack>
      </Pressable>
    </VStack>
  );
}
