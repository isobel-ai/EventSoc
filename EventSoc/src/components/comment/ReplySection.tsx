import {
  VStack,
  Heading,
  Icon,
  AddIcon,
  Button,
  ButtonText,
  Text
} from "@gluestack-ui/themed";
import { FlatList } from "react-native";
import CommentButton from "./CommentButton";
import CommentInputModal from "./CommentInputModal";
import ErrorAlert from "../error/ErrorAlert";
import { isUndefined } from "lodash";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { CommentDoc, ReplyDoc } from "../../../../Shared/models/CommentOrReply";
import {
  retrieveCommentReplies,
  retrieveReplyReplies
} from "../../services/event/eventCommentRepliesService";
import { UserOverview } from "../../../../Shared/models/User";

type Props = {
  eventId: string;
  eventOrganiserExec?: UserOverview[];
} & (
  | { comment: CommentDoc; topLevelCommentId?: never }
  | { comment: ReplyDoc; topLevelCommentId: string }
);

export default function ReplySection(props: Props) {
  const [showPostCommentModal, setShowPostCommentModal] =
    useState<boolean>(false);

  const [replies, setReplies] = useState<ReplyDoc[]>([]);
  const [showRetrieveRepliesErr, setShowRetrieveRepliesErr] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (props.topLevelCommentId === undefined
        ? retrieveCommentReplies(props.eventId, props.comment.id)
        : retrieveReplyReplies(
            props.eventId,
            props.topLevelCommentId,
            props.comment.data.replyIds
          )
      )
        .then((newReplies) => {
          setReplies(newReplies);
          setShowRetrieveRepliesErr(false);
        })
        .catch((err) => {
          console.error(err);
          setShowRetrieveRepliesErr(true);
        });
    }
  }, [isFocused]);

  return (
    <FlatList
      scrollEnabled={false}
      contentContainerStyle={{ paddingBottom: 10, gap: 10 }}
      ListHeaderComponent={
        <VStack
          gap={5}
          alignContent="center">
          <Heading
            alignSelf="flex-start"
            paddingHorizontal={15}>
            Replies:
          </Heading>
          <Button
            width="93%"
            onPress={() => setShowPostCommentModal(true)}
            isDisabled={isUndefined(props.eventOrganiserExec)}>
            <Icon
              as={AddIcon}
              marginRight={5}
              color="white"
              size="lg"
            />
            <ButtonText>Post Reply</ButtonText>
          </Button>
          {!isUndefined(props.eventOrganiserExec) &&
            (props.topLevelCommentId === undefined ? (
              <CommentInputModal
                showModal={showPostCommentModal}
                setShowModal={setShowPostCommentModal}
                eventId={props.eventId}
                eventOrganiserExec={props.eventOrganiserExec}
                topLevelCommentId={props.comment.id}
              />
            ) : (
              <CommentInputModal
                showModal={showPostCommentModal}
                setShowModal={setShowPostCommentModal}
                eventId={props.eventId}
                eventOrganiserExec={props.eventOrganiserExec}
                topLevelCommentId={props.topLevelCommentId}
                parentReplyId={props.comment.id}
                ancestorReplyIds={props.comment.data.parentReplyIds}
              />
            ))}
        </VStack>
      }
      data={replies}
      renderItem={({ item }) => (
        <CommentButton
          eventId={props.eventId}
          topLevelCommentId={props.topLevelCommentId ?? props.comment.id}
          comment={item}
        />
      )}
      ListEmptyComponent={
        showRetrieveRepliesErr ? (
          <ErrorAlert message="Couldn't retrieve replies. Try again later." />
        ) : (
          <Text
            fontSize={"$lg"}
            alignSelf="center">
            No Replies
          </Text>
        )
      }
    />
  );
}
