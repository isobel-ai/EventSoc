import { RetrieveSocEvent } from "../../models/SocEvent";
import { useEffect, useState } from "react";
import { retrieveSocEvents } from "../../services/socEventsService";
import { useIsFocused } from "@react-navigation/native";
import { Alert, AlertText } from "@gluestack-ui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../../config/gluestack-ui.config";
import ScreenView from "../../components/ScreenView";
import EventFilter from "../../components/EventFilter";
import EventFeed from "../../components/EventFeed";
import { useEventsContext } from "../../contexts/EventsContext";

export default function EventsScreen() {
  const { socEvents, setSocEvents } = useEventsContext();

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
      {retrieveSocEventsErrMsg ? (
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
            <AlertText>{retrieveSocEventsErrMsg}</AlertText>
          </Alert>
        </ScreenView>
      ) : (
        <EventFilter
          socEvents={socEvents}
          setFullyFilteredSocEvents={setFilteredSocEvents}>
          <EventFeed feed={filteredSocEvents} />
        </EventFilter>
      )}
    </>
  );
}
