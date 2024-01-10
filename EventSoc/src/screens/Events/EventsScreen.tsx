import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Alert, AlertText } from "@gluestack-ui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../../config/gluestack-ui.config";
import ScreenView from "../../components/ScreenView";
import EventFilter from "../../components/EventFilter";
import EventFeed from "../../components/EventFeed";
import { Event } from "../../models/Event";

export default function EventsScreen() {
  const { events, updateEvents } = useAppContext();


  const [filteredSocEvents, setFilteredSocEvents] = useState<
    RetrieveSocEvent[]
  >([]);

  const [retrieveSocEventsErrMsg, setRetrieveSocEventsErrMsg] =
    useState<string>("");

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      retrieveSocEvents().then((result) => {
        if (result instanceof Error) {
          setRetrieveSocEventsErrMsg(result.message);
        } else {
          setSocEvents(result);
          setRetrieveSocEventsErrMsg("");
        }
      });
  }, [isFocused]);

  return (
    <>
      {retrieveEventsErrMsg ? (
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
            <AlertText>{retrieveEventsErrMsg}</AlertText>
          </Alert>
        </ScreenView>
      ) : (
        <EventFilter
          events={upcomingEvents}
          setFullyFilteredEvents={setFilteredEvents}>
          <EventFeed feed={filteredEvents} />
        </EventFilter>
      )}
    </>
  );
}
