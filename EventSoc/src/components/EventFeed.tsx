import { Text } from "@gluestack-ui/themed";
import { RetrieveSocEvent } from "../models/SocEvent";
import EventPost from "./EventPost";
import { FlatList } from "react-native";

interface Props {
  feed: RetrieveSocEvent[];
}

export default function EventFeed(props: Props) {
  return (
    <FlatList
      data={props.feed}
      renderItem={({ item }) => <EventPost socEvent={item} />}
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
