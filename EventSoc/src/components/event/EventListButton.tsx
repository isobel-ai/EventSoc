import { Button, ButtonText, HStack, Image } from "@gluestack-ui/themed";
import { EventDoc, EventOverview } from "../../../../Shared/models/Event";
import { config } from "../../../config/gluestack-ui.config";
import {
  useNavigation,
  NavigationProp,
  useIsFocused
} from "@react-navigation/native";
import { SocietiesStackParamList } from "../../navigation/SocietiesNavigator/SocietiesStackNavigator";
import EventMenu from "./EventMenu";
import { isUndefined } from "lodash";
import { useState, useEffect } from "react";
import { retrieveEventImage } from "../../services/event/eventsService";
import retrievePictureErrImage from "../../assets/images/photoUpload.png";

type Props = {
  event: EventOverview;
  isExec: boolean;
};

export default function EventListButton(props: Props) {
  const { navigate } = useNavigation<NavigationProp<SocietiesStackParamList>>();

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

  const showImage = image || showRetrieveImageErr;

  return (
    <Button
      onPress={() => navigate("Event", { eventId: props.event.id })}
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
          color={config.tokens.colors.black}
          numberOfLines={2}
          ellipsizeMode="tail"
          lineBreakStrategyIOS="standard"
          marginLeft={showImage ? 85 : undefined}
          width={showImage ? "78%" : "100%"}
          textAlign={showImage ? undefined : "center"}>
          {props.event.name}
        </ButtonText>
      </HStack>
      {props.isExec && props.event.startDate > new Date() && (
        <EventMenu eventId={props.event.id} />
      )}
    </Button>
  );
}
