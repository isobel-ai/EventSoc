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
import SocietyPressable from "../society/SocietyPressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { toDateTimeRangeString } from "../../helpers/DateTimeHelper";
import { StyleProp, ViewStyle } from "react-native";
import { EventDoc } from "../../../../Shared/models/Event";
import EventMenu from "./EventMenu";
import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { retrieveEventImage } from "../../services/event/eventsService";
import { isUndefined } from "lodash";
import { useIsFocused } from "@react-navigation/native";
import ErrorAlert from "../error/ErrorAlert";
import { config } from "../../config/gluestack-ui.config";

type Props = {
  event: EventDoc;
  isExtended?: boolean;
  onPress?: () => void;
};

export default function EventPost(props: Props) {
  const { userId } = useUserContext();

  const [image, setImage] = useState<string>();
  const [showRetrieveImageErr, setShowRetrieveImageErr] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      retrieveEventImage(props.event.id)
        .then((url) => {
          setImage(url);
          setShowRetrieveImageErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          isUndefined(image) && setShowRetrieveImageErr(true);
        });
  }, [isFocused]);

  const isExec = props.event.data.organiser.exec.some(
    (member) => member.id === userId
  );

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
      <SocietyPressable socOverview={props.event.data.organiser} />
      {isExec && props.event.data.startDate > new Date() && (
        <EventMenu
          eventId={props.event.id}
          organiserId={props.event.data.organiser.id}
        />
      )}
      <Pressable onPress={props.onPress}>
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
              color={config.tokens.colors.black}
            />
            <Text>{props.event.data.location}</Text>
          </HStack>
          {showRetrieveImageErr ? (
            <ErrorAlert message="Couldn't retrieve event image. Try again later." />
          ) : (
            image && (
              <Image
                size="2xl"
                source={image}
                alt=""
                alignSelf="center"
              />
            )
          )}
          {props.isExtended && (
            <>
              {props.event.data.description && (
                <Text>
                  <Text fontWeight="$bold">Description: </Text>
                  <Text>{props.event.data.description}</Text>
                </Text>
              )}
              {props.event.data.tags.length > 0 && (
                <Text>
                  <Text fontWeight="$bold">Tags: </Text>
                  <Text>{props.event.data.tags.join(", ")}</Text>
                </Text>
              )}
            </>
          )}
        </VStack>
      </Pressable>
    </VStack>
  );
}
