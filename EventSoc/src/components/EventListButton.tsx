import { Button, ButtonText, Image } from "@gluestack-ui/themed";
import { Event } from "../models/Event";
import { config } from "../../config/gluestack-ui.config";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SocietiesStackParamList } from "../navigation/Societies/SocietiesStackNavigator";
import EventMenu from "./EventMenu";
import { memo } from "react";

interface Props {
  event: Event;
  isExec: boolean;
}

function EventListButton(props: Props) {
  const { navigate } = useNavigation<NavigationProp<SocietiesStackParamList>>();

  return (
    <Button
      onPress={() => navigate("Event", { eventId: props.event.id })}
      backgroundColor={config.tokens.colors.eventButtonGray}
      height={100}
      width="95%"
      alignSelf="center">
      {props.event.data.pictureUrl && (
        <Image
          size="md"
          source={props.event.data.pictureUrl}
          alt=""
          style={{ position: "absolute", left: 10 }}
        />
      )}
      <ButtonText
        color="black"
        numberOfLines={2}
        ellipsizeMode="tail"
        lineBreakStrategyIOS="standard">
        {props.event.data.name}
      </ButtonText>
      {props.isExec && <EventMenu event={props.event} />}
    </Button>
  );
}

export default memo(EventListButton);
