import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Alert, AlertText } from "@gluestack-ui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../config/gluestack-ui.config";
import ScreenView from "../components/ScreenView";
import EventFilter from "../components/EventFilter";
import EventFeed from "../components/EventFeed";
import { useAppContext } from "../contexts/AppContext";
import { Event } from "../../../Models/Event";

export default function EventsScreen() {
  const { events, updateEvents } = useAppContext();

  const upcomingEvents = events.filter(
    (event) => event.data.endDate > new Date()
  );

  const [filteredEvents, setFilteredEvents] = useState<Event[]>(upcomingEvents);

  const [retrieveEventsErrMsg, setRetrieveEventsErrMsg] = useState<string>("");

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      updateEvents()
        .then(() => setRetrieveEventsErrMsg(""))
        .catch((err) => !events.length && setRetrieveEventsErrMsg(err.message));
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
