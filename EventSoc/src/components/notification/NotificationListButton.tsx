import { HStack, Image, Button, ButtonText, Text } from "@gluestack-ui/themed";
import { config } from "../../../config/gluestack-ui.config";
import {
  useNavigation,
  NavigationProp,
  useIsFocused
} from "@react-navigation/native";
import { NotificationData } from "../../../../Shared/models/Notification";
import { NotificationStackParamList } from "../../navigation/NotificationStackNavigator";
import { useEffect, useState } from "react";
import { isUndefined } from "lodash";
import { retrieveEventImage } from "../../services/event/eventsService";
import retrievePictureErrImage from "../../assets/images/photoUpload.png";
import { toTimeAgoString } from "../../helpers/DateTimeHelper";

type Props = {
  notification: NotificationData;
};

export default function NotificationListButton(props: Props) {
  const { navigate } =
    useNavigation<NavigationProp<NotificationStackParamList>>();

  const [image, setImage] = useState<string>();
  const [showRetrieveImageErr, setShowRetrieveImageErr] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      (props.notification.payload.type === "EVENT" ||
        props.notification.payload.type === "REPLY") &&
      retrieveEventImage(props.notification.payload.eventId)
        .then((url) => {
          setImage(url);
          setShowRetrieveImageErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          isUndefined(image) && setShowRetrieveImageErr(true);
        });
  }, [isFocused]);

  const handleNavigation = () => {
    switch (props.notification.payload.type) {
      case "EVENT":
        navigate("Event", { eventId: props.notification.payload.eventId });
        break;
      case "REPLY":
        navigate("Reply", {
          eventId: props.notification.payload.eventId,
          topLevelCommentId: props.notification.payload.topLevelCommentId,
          replyId: props.notification.payload.replyParentId
        });
    }
  };

  const showImage = image || showRetrieveImageErr;

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
        {showImage && (
          <Image
            size="md"
            source={showRetrieveImageErr ? retrievePictureErrImage : image}
            alt=""
            style={{ position: "absolute", left: -5 }}
          />
        )}
        <ButtonText
          color="black"
          numberOfLines={2}
          ellipsizeMode="tail"
          lineBreakStrategyIOS="standard"
          marginLeft={showImage ? 85 : undefined}
          width={showImage ? "78%" : "100%"}
          textAlign={showImage ? undefined : "center"}>
          {props.notification.body.split(":")[0]}
        </ButtonText>
      </HStack>
      <Text
        style={{
          color: config.tokens.colors.secondary500,
          position: "absolute",
          right: 10,
          bottom: 5
        }}>
        {toTimeAgoString(props.notification.timestamp)}
      </Text>
    </Button>
  );
}
