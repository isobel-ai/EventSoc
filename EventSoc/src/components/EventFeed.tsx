import { Text } from "@gluestack-ui/themed";
import { RetrieveSocEvent } from "../models/SocEvent";
import EventPost from "./EventPost";
import { FlatList } from "react-native";
import { useEventsContext } from "../contexts/EventsContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { EventsStackParamList } from "../navigation/EventsStackNavigator";

interface Props {
  feed: RetrieveSocEvent[];
}

export default function EventFeed(props: Props) {
  const { selectedSocEvent, setSelectedSocEvent } = useEventsContext();

  const { navigate } = useNavigation<NavigationProp<EventsStackParamList>>();

  const handleEventPostPress = (socEvent: RetrieveSocEvent) => {
    setSelectedSocEvent(socEvent);
    navigate("Event");
  };

  return (
    <FlatList
      data={props.feed}
      renderItem={({ item }) => (
        <EventPost
          socEvent={item}
          onPress={() => handleEventPostPress(item)}
        />
      )}
      keyboardShouldPersistTaps="always"
      ListEmptyComponent={
        <Text
          fontSize={"$lg"}
          alignSelf="center"
          paddingTop={10}>
          No events
        </Text>
      }
    />
  );
}
