import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import ScreenView from "../components/general/ScreenView";
import EventFilter from "../components/event/EventFilter";
import EventFeed from "../components/event/EventFeed";
import { EventDoc } from "../../../Shared/models/Event";
import { retrieveUpcomingEvents } from "../services/event/eventsService";
import { isUndefined } from "lodash";
import ErrorAlert from "../components/error/ErrorAlert";

export default function EventsScreen() {
  const [upcomingEvents, setUpcomingEvents] = useState<EventDoc[]>();
  const [showRetrieveEventsErr, setShowRetrieveEventsErr] =
    useState<boolean>(false);

  const [filteredEvents, setFilteredEvents] = useState<EventDoc[]>();

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      retrieveUpcomingEvents()
        .then((events) => {
          setUpcomingEvents(events);
          isUndefined(filteredEvents) && setFilteredEvents(events);
          setShowRetrieveEventsErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          isUndefined(upcomingEvents) && setShowRetrieveEventsErr(true);
        });
  }, [isFocused]);

  return (
    <>
      {showRetrieveEventsErr ? (
        <ScreenView>
          <ErrorAlert
            message="Couldn't retrieve events. Try again later."
            style={{ marginTop: 10 }}
          />
        </ScreenView>
      ) : (
        !isUndefined(upcomingEvents) &&
        !isUndefined(filteredEvents) && (
          <EventFilter
            events={upcomingEvents}
            setFullyFilteredEvents={setFilteredEvents}>
            <EventFeed feed={filteredEvents} />
          </EventFilter>
        )
      )}
    </>
  );
}
