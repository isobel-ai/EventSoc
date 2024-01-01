import {
  CalendarDaysIcon,
  HStack,
  Heading,
  Icon,
  Image,
  Text,
  VStack
} from "@gluestack-ui/themed";
import { RetrieveSocEvent } from "../models/SocEvent";
import SocietyLabel from "./SocietyLabel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { toDateRangeString } from "../helpers/DateTimeHelper";
import { StyleProp, ViewStyle } from "react-native";

interface Props {
  socEvent: RetrieveSocEvent;
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
      <SocietyLabel society={props.socEvent.society} />
      <VStack
        width="100%"
        alignItems="flex-start"
        paddingHorizontal={15}
        gap={5}>
        <Heading>{props.socEvent.event.name}</Heading>
        <HStack style={iconTextContainerStyle}>
          <Icon
            as={CalendarDaysIcon}
            size="lg"
          />
          <Text>
            {toDateRangeString(
              props.socEvent.event.startDate,
              props.socEvent.event.endDate
            )}
          </Text>
        </HStack>
        <HStack style={iconTextContainerStyle}>
          <MaterialIcons
            name="location-on"
            size={23}
            color="black"
          />
          <Text>{props.socEvent.event.location}</Text>
        </HStack>
      </VStack>
      {props.socEvent.event.pictureUrl && (
        <Image
          size="2xl"
          source={props.socEvent.event.pictureUrl}
          alt=""
        />
      )}
    </VStack>
  );
}
