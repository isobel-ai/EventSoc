import { HStack, Image, Button, ButtonText } from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Notification } from "../../../Models/Notification";
import { NotificationStackParamList } from "../navigation/NotificationStackNavigator";
import { useAppContext } from "../contexts/AppContext";
import { Event } from "../../../Models/Event";

interface Props {
  notification: Notification;
}

export default function NotificationListButton(props: Props) {
  const { navigate } =
    useNavigation<NavigationProp<NotificationStackParamList>>();

  const { events } = useAppContext();

  let event: Event | undefined;
  switch (props.notification.payload.type) {
    case "EVENT":
    case "REPLY":
      const eventId = props.notification.payload.eventId;
      event = events.find((event) => event.id === eventId);
  }

  const handleNavigation = () => {
    switch (props.notification.payload.type) {
      case "EVENT":
        navigate("Event", { eventId: props.notification.payload.eventId });
        break;
      case "REPLY":
        navigate("Reply", {
          commentId: props.notification.payload.commentId,
          eventOrganiserId: event?.data.organiserId
        });
    }
  };

  return (
    <Button
      onPress={handleNavigation}
      backgroundColor={config.tokens.colors.eventButtonGray}
      height={100}
      width="95%"
      alignSelf="center">
      <HStack
        gap={10}
        width="105%"
        alignItems="center">
        {props.notification.payload.type === "EVENT" &&
          event?.data.pictureUrl && (
            <Image
              size="md"
              source={event.data.pictureUrl}
              alt=""
            />
          )}
        <ButtonText
          width={
            props.notification.payload.type === "EVENT" &&
            event?.data.pictureUrl
              ? "79%"
              : "100%"
          }
          color="black"
          numberOfLines={2}
          ellipsizeMode="tail"
          lineBreakStrategyIOS="standard"
          justifyContent="center">
          {props.notification.body}
        </ButtonText>
      </HStack>
    </Button>
  );
}
