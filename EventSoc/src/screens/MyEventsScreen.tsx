import { AlertText, Divider, Alert } from "@gluestack-ui/themed";
import { useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react";
import EventListButton from "../components/EventListButton";
import ScreenView from "../components/ScreenView";
import SearchList from "../components/SearchList";
import { useAppContext } from "../contexts/AppContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../config/gluestack-ui.config";
import { StackScreenProps } from "@react-navigation/stack";
import { MyEventsStackParamList } from "../navigation/MyEventsStackNavigator";

type Props = StackScreenProps<MyEventsStackParamList, "Home">;

export default function MyEventsScreen(props: Props) {
  const { events, userId, updateEvents, societies } = useAppContext();

  const myEvents = events.filter((event) =>
    event.data.attendeeIds.includes(userId)
  );

  const [retrieveEventsErrMsg, setRetrieveEventsErrMsg] = useState<string>("");

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      updateEvents()
        .then(() => {
          setRetrieveEventsErrMsg("");
        })
        .catch((err) => !events.length && setRetrieveEventsErrMsg(err.message));
  }, [isFocused]);

  const isExec = (eventOrganiserId: string) =>
    societies
      .find((soc) => soc.id === eventOrganiserId)
      ?.data.execIds.includes(userId) ?? false;

  return (
    <ScreenView>
      {retrieveEventsErrMsg ? (
        <Alert
          action="error"
          variant="outline"
          width="80%"
          alignSelf="center">
          <MaterialIcons
            name="error-outline"
            size={40}
            color={config.tokens.colors.error}
            style={{ paddingRight: 10 }}
          />
          <AlertText>{retrieveEventsErrMsg}</AlertText>
        </Alert>
      ) : (
        <SearchList
          data={myEvents}
          renderItem={(event) => (
            <EventListButton
              event={event}
              isExec={isExec(event.data.organiserId)}
            />
          )}
          searchKeys={["data.name"]}
          itemSeperator={() => (
            <Divider
              h="$1"
              bgColor="transparent"
            />
          )}
          maxHeight="102%"
          listEmptyText="No events"
        />
      )}
    </ScreenView>
  );
}
