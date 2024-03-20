import { Spinner, Text } from "@gluestack-ui/themed";
import { EventDoc } from "../../../../Shared/models/Event";
import EventPost from "./EventPost";
import { FlatList } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { EventsStackParamList } from "../../navigation/EventsStackNavigator";
import { isUndefined } from "lodash";

type Props = {
  feed?: EventDoc[];
};

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
        isUndefined(props.feed) ? (
          <Spinner
            marginTop={30}
            size={"large"}
          />
        ) : (
          <Text
            fontSize={"$lg"}
            alignSelf="center"
            paddingTop={10}>
            No events
          </Text>
        )
      }
    />
  );
}
