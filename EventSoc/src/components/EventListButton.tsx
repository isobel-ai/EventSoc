import { Button, ButtonText, Image } from "@gluestack-ui/themed";
import { Event } from "../models/Event";
import { config } from "../../config/gluestack-ui.config";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SocietiesStackParamList } from "../navigation/Societies/SocietiesStackNavigator";
import EventMenu from "./EventMenu";

interface Props {
  event: Event;
  isExec: boolean;
}

export default function EventListButton(props: Props) {
  const { navigate } = useNavigation<NavigationProp<SocietiesStackParamList>>();

  return (
    <Button
      onPress={() => navigate("Event", { eventId: props.event.id })}
      backgroundColor={config.tokens.colors.eventButtonGray}
      height={100}
      width="100%"
      alignSelf="center"
      borderRadius="$none">
      {props.event.data.pictureUrl && (
        <Image
          size="md"
          source={props.event.data.pictureUrl}
          alt=""
          style={{ position: "absolute", left: 10 }}
        />
      )}
      <ButtonText
        numberOfLines={2}
        ellipsizeMode="tail"
        lineBreakStrategyIOS="standard">
        {props.event.data.name}
      </ButtonText>
      {props.isExec && <EventMenu event={props.event} />}
    </Button>
  );
}
