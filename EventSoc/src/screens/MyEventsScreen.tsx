import { Divider } from "@gluestack-ui/themed";
import { useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react";
import EventListButton from "../components/event/EventListButton";
import ScreenView from "../components/general/ScreenView";
import SearchList from "../components/general/SearchList";
import { useUserContext } from "../contexts/UserContext";
import ErrorAlert from "../components/error/ErrorAlert";
import { EventOverview } from "../../../Shared/models/Event";
import { retrieveUserEventsAttendingOverviews } from "../services/user/userEventsAttendingService";
import { isUndefined } from "lodash";
import { Name } from "../../../Shared/models/Name";
import { retrieveUserExecMemberSocieties } from "../services/user/userExecMemberSocietiesService";

export default function MyEventsScreen() {
  const { userId } = useUserContext();

  const [myEvents, setMyEvents] = useState<EventOverview[]>();
  const [showRetrieveEventsErr, setShowRetrieveEventsErr] =
    useState<boolean>(false);

  const [userExecSocieties, setUserExecSocieties] = useState<Name[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      retrieveUserEventsAttendingOverviews(userId)
        .then((newMyEvents) => {
          setMyEvents(newMyEvents);
          setShowRetrieveEventsErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          isUndefined(myEvents) && setShowRetrieveEventsErr(true);
        });

      retrieveUserExecMemberSocieties(userId)
        .then(setUserExecSocieties)
        .catch((err) => console.error(err.message));
    }
  }, [isFocused]);

  return (
    <ScreenView removeBottomPadding>
      {showRetrieveEventsErr ? (
        <ErrorAlert
          message="Couldn't retrieve your events. Try again later"
          style={{ marginTop: 10 }}
        />
      ) : (
        !isUndefined(myEvents) && (
          <SearchList
            maxHeight="99%"
            data={myEvents}
            renderItem={(event) => (
              <EventListButton
                event={event}
                isExec={userExecSocieties.some(
                  (soc) => soc.id === event.organiserId
                )}
              />
            )}
            searchKeys={["name"]}
            itemSeperator={() => (
              <Divider
                h="$1"
                bgColor="transparent"
              />
            )}
            listEmptyText="No events"
          />
        )
      )}
    </ScreenView>
  );
}
