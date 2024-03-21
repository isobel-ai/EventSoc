import { Divider, Spinner } from "@gluestack-ui/themed";
import { FlatList } from "react-native";
import CommentButton from "./CommentButton";
import ErrorAlert from "../error/ErrorAlert";
import { CommentDoc, ReplyDoc } from "../../../../Shared/models/CommentOrReply";
import { useEffect, useState } from "react";
import { isUndefined } from "lodash";
import { retrieveReplyParentReplies } from "../../services/event/eventCommentRepliesService";
import { retrieveComment } from "../../services/event/eventCommentsService";
import { useIsFocused } from "@react-navigation/native";
import { config } from "../../config/gluestack-ui.config";

type Props = {
  eventId: string;
  topLevelCommentId: string;
  replyParentIds: string[];
};

export default function CommentThread(props: Props) {
  const [topLevelComment, setTopLevelComment] = useState<CommentDoc | Error>();
  const [parentReplies, setParentReplies] = useState<(ReplyDoc | Error)[]>();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      retrieveComment(props.eventId, props.topLevelCommentId)
        .then(setTopLevelComment)
        .catch((err) => {
          console.error(err.message);
          setTopLevelComment(Error());
        });

      retrieveReplyParentReplies(
        props.eventId,
        props.topLevelCommentId,
        props.replyParentIds
      )
        .then(setParentReplies)
        .catch((err) => {
          console.error(err.message);
          console.warn("This catch-block should never be triggered");
          setParentReplies([Error()]);
        });
    }
  }, [isFocused]);

  const CommentDivider = () => (
    <Divider
      orientation="vertical"
      height="$5"
      bgColor={config.tokens.colors.black}
      marginHorizontal={20}
      width="$1"
    />
  );

  return (
    <FlatList
      scrollEnabled={false}
      ListHeaderComponent={
        <>
          {isUndefined(topLevelComment) ? (
            <Spinner marginVertical={10} />
          ) : (
            <>
              {topLevelComment instanceof Error ? (
                <ErrorAlert
                  message="Couldn't retrieve comment. Try again later"
                  width="93%"
                />
              ) : (
                <CommentButton
                  eventId={props.eventId}
                  comment={topLevelComment}
                />
              )}
              {!isUndefined(parentReplies) && <CommentDivider />}
            </>
          )}
        </>
      }
      data={parentReplies}
      renderItem={({ item }) =>
        item instanceof Error ? (
          <ErrorAlert
            message="Couldn't retrieve comment. Try again later"
            width="93%"
          />
        ) : (
          <CommentButton
            eventId={props.eventId}
            topLevelCommentId={props.topLevelCommentId}
            comment={item}
          />
        )
      }
      ItemSeparatorComponent={CommentDivider}
      ListFooterComponent={
        parentReplies?.length ? <CommentDivider /> : undefined
      }
      ListEmptyComponent={
        isUndefined(parentReplies) ? <Spinner marginVertical={10} /> : undefined
      }
    />
  );
}
