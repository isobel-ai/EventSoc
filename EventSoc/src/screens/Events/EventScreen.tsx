import { ScrollView, Text, VStack } from "@gluestack-ui/themed";
import EventPost from "../../components/EventPost";
import ScreenView from "../../components/ScreenView";
import { useEventsContext } from "../../contexts/EventsContext";

export default function EventScreen() {
  const { selectedSocEvent } = useEventsContext();

  return (
    <ScreenView extraStyle={{ height: "107%" }}>
      <ScrollView>
        <EventPost socEvent={selectedSocEvent} />
        <VStack
          alignItems="flex-start"
          marginHorizontal={18}>
          {selectedSocEvent.event.description && (
            <>
              <Text fontWeight="$bold">Description:</Text>
              <Text>{selectedSocEvent.event.description}</Text>
            </>
          )}
          {selectedSocEvent.event.tags.length > 0 && (
            <>
              <Text fontWeight="$bold">Tags:</Text>
              <Text>{selectedSocEvent.event.tags.join(", ")}</Text>
            </>
          )}
        </VStack>
      </ScrollView>
    </ScreenView>
  );
}
