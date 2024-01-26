import {
  Text,
  Pressable,
  Icon,
  MessageCircleIcon,
  HStack
} from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { Comment } from "../../../Models/Comment";
import { useAppContext } from "../contexts/AppContext";
import { StyleProp, TextStyle } from "react-native";
import { toTimeAgoString } from "../helpers/DateTimeHelper";
import { useNavigation } from "@react-navigation/native";
import { EventStackParamList } from "../navigation/CrossTabStackScreens/EventStackScreens";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useMemo } from "react";

interface Props {
  comment: Comment;
  eventOrganiserId?: string;
  disableButton?: boolean;
}

export default function CommentButton(props: Props) {
  const { push } = useNavigation<StackNavigationProp<EventStackParamList>>();

  const { users, updateUserData, societies, updateSocietyData } =
    useAppContext();

  useEffect(() => {
    updateUserData(props.comment.data.authorId).catch();
    props.eventOrganiserId && updateSocietyData(props.eventOrganiserId).catch();
  }, []);

  const authorName = users.find(
    (user) => user.id === props.comment.data.authorId
  )?.data.name;

  const isExec = props.eventOrganiserId
    ? societies
        .find((soc) => soc.id === props.eventOrganiserId)
        ?.data.execIds.includes(props.comment.data.authorId) ?? false
    : false;

  const buttonTextStyle: StyleProp<TextStyle> = {
    color: "black",
    fontSize: config.tokens.fontSizes.sm,
    lineHeight: 20,
    fontWeight: "normal"
  };

  return useMemo(
    () => (
      <Pressable
        onPress={() =>
          push("Reply", {
            commentId: props.comment.id,
            eventOrganiserId: props.eventOrganiserId
          })
        }
        disabled={props.disableButton}
        backgroundColor={config.tokens.colors.eventButtonGray}
        width="93%"
        alignSelf="center"
        padding={10}>
        <HStack>
          <Text style={[buttonTextStyle, { fontWeight: "bold" }]}>
            {authorName ?? "User Not Found"}
          </Text>
          {isExec && (
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
          <Text
            style={[
              buttonTextStyle,
              { color: config.tokens.colors.primary500 }
            ]}>
            {props.comment.data.replyIds.length}
          </Text>
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
    ),
    [props, users, societies]
  );
}
