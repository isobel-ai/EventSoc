import ScreenView from "../../components/general/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";
import { Divider, Heading, Spinner } from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { config } from "../../config/gluestack-ui.config";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { EventDoc } from "../../../../Shared/models/Event";
import { isUndefined } from "lodash";
import { retrieveEventData } from "../../services/event/eventsService";
import ErrorAlert from "../../components/error/ErrorAlert";
import EventPostAndSignUp from "../../components/event/EventPostAndSignUp";
import OnDeleteEventContext, {
  OnDeleteEventContent
} from "../../contexts/OnDeleteEventContext";
import { ReplyDoc } from "../../../../Shared/models/CommentOrReply";
import CommentThread from "../../components/comment/CommentThread";
import ReplySection from "../../components/comment/ReplySection";
import { retrieveCommentReply } from "../../services/event/eventCommentRepliesService";
import { retrieveComment } from "../../services/event/eventCommentsService";
import CommentButton from "../../components/comment/CommentButton";

type Props = StackScreenProps<EventStackParamList, "Reply">;

export default function ReplyScreen(props: Props) {
  const onDeleteEventContent: OnDeleteEventContent = {
    onDeleteEvent: props.navigation.goBack
  };

  const [event, setEvent] = useState<EventDoc>();
  const [showRetrieveEventErr, setShowRetrieveEventErr] =
    useState<boolean>(false);

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

  const [focusComment, setFocusComment] = useState<ReplyDoc>();
  const [showRetrieveCommentErr, setShowRetrieveCommentErr] =
    useState<boolean>(false);

  const updateComment = () =>
    (isUndefined(props.route.params.topLevelCommentId)
      ? retrieveComment(props.route.params.eventId, props.route.params.replyId)
      : retrieveCommentReply(
          props.route.params.eventId,
          props.route.params.topLevelCommentId,
          props.route.params.replyId
        )
    )
      .then((comment) => {
        setFocusComment(comment as ReplyDoc);
        setShowRetrieveCommentErr(false);
      })
      .catch((err) => {
        console.error(err.message);
        isUndefined(focusComment) && setShowRetrieveCommentErr(true);
      });

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && updateComment().finally(updateEvent);
  }, [isFocused]);

  const SectionDivider = () => (
    <Divider
      alignSelf="center"
      width="100%"
      marginTop={10}
      bgColor={config.tokens.colors.eventButtonGray}
    />
  );

  const [showPostCommentModal, setShowPostCommentModal] =
    useState<boolean>(false);

  useEffect(() => {
    !showPostCommentModal && updateComment();
  }, [showPostCommentModal]);

  return (
    <OnDeleteEventContext.Provider value={onDeleteEventContent}>
      <ScreenView removeBottomPadding>
        <ScrollView maintainVisibleContentPosition={{ minIndexForVisible: 2 }}>
          {showRetrieveEventErr ? (
            <ErrorAlert
              message="Could not retrieve event details. Try again later."
              style={{ marginTop: 10 }}
            />
          ) : isUndefined(event) ? (
            <Spinner
              size="large"
              marginVertical={20}
            />
          ) : (
            <EventPostAndSignUp
              event={event}
              updateEvent={updateEvent}
              isEventPostExtended
              onEventPostPress={() =>
                props.navigation.navigate("Event", {
                  eventId: props.route.params.eventId
                })
              }
            />
          )}
          <SectionDivider />
          {showRetrieveCommentErr ? (
            <ErrorAlert
              message="Couldn't retrieve comments. Try again later."
              style={{ marginVertical: 10 }}
            />
          ) : isUndefined(focusComment) ? (
            <Spinner
              size="large"
              marginVertical={15}
            />
          ) : (
            <>
              <Heading
                alignSelf="flex-start"
                marginLeft={10}>
                Comment Thread:
              </Heading>
              {!isUndefined(props.route.params.topLevelCommentId) && (
                <CommentThread
                  eventId={props.route.params.eventId}
                  topLevelCommentId={props.route.params.topLevelCommentId}
                  replyParentIds={focusComment.data.parentReplyIds}
                />
              )}
              <CommentButton
                eventId={props.route.params.eventId}
                comment={focusComment}
                topLevelCommentId={props.route.params.topLevelCommentId}
                disableButton
                refreshCountTrigger={[showPostCommentModal, focusComment.data]}
              />
              <SectionDivider />
              <ReplySection
                eventId={props.route.params.eventId}
                eventOrganiserExec={event?.data.organiser.exec}
                showPostCommentModal={showPostCommentModal}
                setShowPostCommentModal={setShowPostCommentModal}
                comment={focusComment}
                topLevelCommentId={props.route.params.topLevelCommentId}
              />
            </>
          )}
        </ScrollView>
      </ScreenView>
    </OnDeleteEventContext.Provider>
  );
}
