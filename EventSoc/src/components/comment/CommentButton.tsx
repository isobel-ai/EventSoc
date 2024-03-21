import {
  Text,
  Pressable,
  Icon,
  MessageCircleIcon,
  HStack
} from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { StyleProp, TextStyle } from "react-native";
import { toTimeAgoString } from "../../helpers/DateTimeHelper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { CommentDoc, ReplyDoc } from "../../../../Shared/models/CommentOrReply";
import { retrieveCommentReplyCount } from "../../services/event/eventCommentsService";
import { isUndefined } from "lodash";

type Props = {
  eventId: string;
  disableButton?: boolean;
  refreshCountTrigger?: any[];
} & (
  | { comment: CommentDoc; topLevelCommentId?: never }
  | { comment: ReplyDoc; topLevelCommentId: string }
);

export default function CommentButton(props: Props) {
  const { push } = useNavigation<StackNavigationProp<EventStackParamList>>();

  const [replyCount, setReplyCount] = useState<number>();

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      (props.topLevelCommentId === undefined
        ? retrieveCommentReplyCount(props.eventId, props.comment.id)
            .then(setReplyCount)
            .catch((err) => console.error(err.message))
        : setReplyCount(props.comment.data.replyIds.length));
  }, [isFocused, ...(props.refreshCountTrigger ?? [])]);

  const buttonTextStyle: StyleProp<TextStyle> = {
    color: config.tokens.colors.black,
    fontSize: config.tokens.fontSizes.sm,
    lineHeight: 20,
    fontWeight: "normal"
  };

  return (
    <Pressable
      onPress={() =>
        push("Reply", {
          eventId: props.eventId,
          topLevelCommentId: props.topLevelCommentId,
          replyId: props.comment.id
        })
      }
      disabled={props.disableButton}
      backgroundColor={config.tokens.colors.eventButtonGray}
      width="93%"
      alignSelf="center"
      padding={10}>
      <HStack>
        <Text style={[buttonTextStyle, { fontWeight: "bold" }]}>
          {props.comment.data.author.name}
        </Text>
        {props.comment.data.isExecComment && (
          <Text
            style={[
              buttonTextStyle,
              {
                fontWeight: "bold",
                color: config.tokens.colors.navigationDarkPink,
                position: "absolute",
                right: 0
              }
            ]}>
            EXEC
          </Text>
        )}
      </HStack>
      <Text
        style={buttonTextStyle}
        numberOfLines={5}
        ellipsizeMode="tail"
        lineBreakStrategyIOS="standard">
        {props.comment.data.contents}
      </Text>
      <HStack alignItems="center">
        <Icon
          as={MessageCircleIcon}
          color={config.tokens.colors.primary400}
          marginRight={5}
        />
        {!isUndefined(replyCount) && (
          <Text
            style={[
              buttonTextStyle,
              { color: config.tokens.colors.primary500 }
            ]}>
            {replyCount}
          </Text>
        )}
        <Text
          style={[
            buttonTextStyle,
            {
              color: config.tokens.colors.secondary500,
              position: "absolute",
              right: 0
            }
          ]}>
          {toTimeAgoString(props.comment.data.timestamp)}
        </Text>
      </HStack>
    </Pressable>
  );
}
