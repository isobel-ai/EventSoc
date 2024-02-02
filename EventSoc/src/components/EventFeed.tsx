import { Text } from "@gluestack-ui/themed";
import { Event } from "../../../Models/Event";
import EventPost from "./EventPost";
import { FlatList } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { EventsStackParamList } from "../navigation/EventsStackNavigator";

interface Props {
  feed: Event[];
}

export default function EventFeed(props: Props) {
  const { navigate } = useNavigation<NavigationProp<EventsStackParamList>>();

  return (
    <FlatList
      data={props.feed}
      renderItem={({ item }) => (
        <EventPost
          event={item}
          onPress={() => navigate("Event", { eventId: item.id })}
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
