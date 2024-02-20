import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import ScreenView from "../components/general/ScreenView";
import EventSortAndFilter from "../components/event/EventSortAndFilter";
import EventFeed from "../components/event/EventFeed";
import { EventDoc, EventDocAndRecScore } from "../../../Shared/models/Event";
import { retrieveUpcomingEventsAndRecScores } from "../services/event/eventsService";
import { isUndefined } from "lodash";
import ErrorAlert from "../components/error/ErrorAlert";
import { useUserContext } from "../contexts/UserContext";

export default function EventsScreen() {
  const { userId } = useUserContext();

  const [upcomingEvents, setUpcomingEvents] = useState<EventDocAndRecScore[]>();
  const [showRetrieveEventsErr, setShowRetrieveEventsErr] =
    useState<boolean>(false);

  const [eventFeed, setEventFeed] = useState<EventDoc[]>();

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      retrieveUpcomingEventsAndRecScores(userId)
        .then((events) => {
          setUpcomingEvents(events);
          isUndefined(eventFeed) && setEventFeed(events);
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
        !isUndefined(eventFeed) && (
          <EventSortAndFilter
            events={upcomingEvents}
            setEventFeed={setEventFeed}>
            <EventFeed feed={eventFeed} />
          </EventSortAndFilter>
        )
      )}
    </>
  );
}
