import ScreenView from "../../components/general/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";
import { Divider, ScrollView } from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { EventDoc } from "../../../../Shared/models/Event";
import { retrieveEventData } from "../../services/event/eventsService";
import { isUndefined } from "lodash";
import OnDeleteEventContext, {
  OnDeleteEventContent
} from "../../contexts/OnDeleteEventContext";
import EventCommentSection from "../../components/event/EventCommentSection";
import ErrorAlert from "../../components/error/ErrorAlert";
import EventPostAndSignUp from "../../components/event/EventPostAndSignUp";
import { config } from "../../../config/gluestack-ui.config";

type Props = StackScreenProps<EventStackParamList, "Event">;

export default function EventScreen(props: Props) {
  const onDeleteEventContent: OnDeleteEventContent = {
    onDeleteEvent: props.navigation.goBack
  };

  const [event, setEvent] = useState<EventDoc>();
  const [showRetrieveEventErr, setShowRetrieveEventErr] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  const updateEvent = () =>
    retrieveEventData(props.route.params.eventId)
      .then((eventData) => {
        setEvent({ id: props.route.params.eventId, data: eventData });
        setShowRetrieveEventErr(false);
      })
      .catch((err) => {
        console.error(err.message);
        isUndefined(event) && setShowRetrieveEventErr(true);
      });

  useEffect(() => {
    isFocused && updateEvent();
  }, [isFocused]);

  return (
    <OnDeleteEventContext.Provider value={onDeleteEventContent}>
      <ScreenView removeBottomPadding>
        <ScrollView>
          {showRetrieveEventErr ? (
            <ErrorAlert
              message="Could not retrieve event details. Try again later."
              style={{ marginVertical: 10 }}
            />
          ) : (
            !isUndefined(event) && (
              <EventPostAndSignUp
                event={event}
                updateEvent={updateEvent}
                isEventPostExtended
              />
            )
          )}
          <Divider
            bgColor={config.tokens.colors.eventButtonGray}
            marginTop={10}
          />
          <EventCommentSection
            eventId={props.route.params.eventId}
            eventOrganiserExec={event?.data.organiser.exec}
          />
        </ScrollView>
      </ScreenView>
    </OnDeleteEventContext.Provider>
  );
}
