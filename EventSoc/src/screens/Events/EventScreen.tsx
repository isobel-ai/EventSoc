import {
  Alert,
  AlertText,
  ScrollView,
  Text,
  VStack
} from "@gluestack-ui/themed";
import EventPost from "../../components/EventPost";
import ScreenView from "../../components/ScreenView";
import { useEventsContext } from "../../contexts/EventsContext";
import { StackScreenProps } from "@react-navigation/stack";
import { EventsStackParamList } from "../../navigation/EventsStackNavigator";
import { config } from "../../../config/gluestack-ui.config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = StackScreenProps<EventsStackParamList, "Event">;

export default function EventScreen(props: Props) {
  const { socEvents } = useEventsContext();

  const socEvent = socEvents.find(
    (socEvent) => socEvent.event.id === props.route.params.eventId
  );

  return (
    <ScreenView extraStyle={{ height: "107%" }}>
      {!socEvent ? (
        <ScreenView>
          <Alert
            action="error"
            variant="outline"
            width="80%"
            marginTop={20}
            alignSelf="center">
            <MaterialIcons
              name="error-outline"
              size={40}
              color={config.tokens.colors.error}
              style={{ paddingRight: 10 }}
            />
            <AlertText>
              Could not retrieve event details. Try again later.
            </AlertText>
          </Alert>
        </ScreenView>
      ) : (
        <ScrollView>
          <EventPost socEvent={socEvent} />
          <VStack
            alignItems="flex-start"
            marginHorizontal={18}>
            {socEvent.event.description && (
              <>
                <Text fontWeight="$bold">Description:</Text>
                <Text>{socEvent.event.description}</Text>
              </>
            )}
            {socEvent.event.tags.length > 0 && (
              <>
                <Text fontWeight="$bold">Tags:</Text>
                <Text>{socEvent.event.tags.join(", ")}</Text>
              </>
            )}
          </VStack>
        </ScrollView>
      )}
    </ScreenView>
  );
}
