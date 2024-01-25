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
import { Event } from "../models/Event";
import EventMenu from "./EventMenu";
import { useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";

interface Props {
  event: Event;
  onPress?: () => void;
}

export default function EventPost(props: Props) {
  const { societies, updateSocietyData, userId } = useAppContext();

  useEffect(() => {
    updateSocietyData(props.event.data.organiserId).catch();
  }, []);

  const isExec =
    societies
      .find((soc) => soc.id === props.event.data.organiserId)
      ?.data.execIds.includes(userId) ?? false;

  const iconTextContainerStyle: StyleProp<ViewStyle> = {
    width: "90%",
    gap: 5,
    alignItems: "center"
  };

  return (
    <VStack
      width="100%"
      gap={10}
      paddingBottom={10}>
      <SocietyPressable societyId={props.event.data.organiserId} />
      {isExec && <EventMenu event={props.event} />}
      <Pressable onPress={props.onPress}>
        <VStack
          gap={15}
          width="100%"
          paddingHorizontal={5}>
          <VStack
            gap={5}
            width="100%"
            alignItems="flex-start">
            <Heading>{props.event.data.name}</Heading>
            <HStack style={iconTextContainerStyle}>
              <Icon
                as={CalendarDaysIcon}
                size="lg"
              />
              <Text width="100%">
                {toDateTimeRangeString(
                  props.event.data.startDate,
                  props.event.data.endDate
                )}
              </Text>
            </HStack>
            <HStack style={iconTextContainerStyle}>
              <MaterialIcons
                name="location-on"
                size={23}
                color="black"
              />
              <Text>{props.event.data.location}</Text>
            </HStack>
          </VStack>
          {props.event.data.pictureUrl && (
            <Image
              size="2xl"
              source={props.event.data.pictureUrl}
              alt=""
            />
          )}
        </VStack>
      </Pressable>
    </VStack>
  );
}
