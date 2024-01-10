import { Text } from "@gluestack-ui/themed";
import { Event } from "../models/Event";
import EventPost from "./EventPost";
import { FlatList } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { EventsStackParamList } from "../navigation/EventsStackNavigator";

interface Props {
  feed: Event[];
}

export default function EventFeed(props: Props) {
  const { navigate } = useNavigation<NavigationProp<EventsStackParamList>>();

  const handleEventPostPress = (socEvent: RetrieveSocEvent) => {
    navigate("Event", { eventId: socEvent.event.id });
  };

  return (
    <FlatList
      data={props.feed}
      renderItem={({ item }) => (
        <EventPost
          event={item.data}
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
