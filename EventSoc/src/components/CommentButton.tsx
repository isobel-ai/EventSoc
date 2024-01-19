import { Text, Pressable, Icon, MessageCircleIcon } from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { Comment } from "../models/Comment";
import { useAppContext } from "../contexts/AppContext";
import { StyleProp, TextStyle } from "react-native";

interface Props {
  comment: Comment;
}

export default function CommentButton(props: Props) {
  const { users } = useAppContext();

  const authorName = users.find(
    (user) => user.id === props.comment.data.authorId
  )?.data.name;

  const buttonTextStyle: StyleProp<TextStyle> = {
    color: "black",
    fontSize: config.tokens.fontSizes.sm,
    lineHeight: 16,
    fontWeight: "normal"
  };

  return (
    <Pressable
      onPress={() => {}}
      backgroundColor={config.tokens.colors.eventButtonGray}
      width="93%"
      alignSelf="center"
      padding={10}>
      {authorName && (
        <Text
          style={[buttonTextStyle, { fontWeight: "bold", marginBottom: -15 }]}>
          {`${authorName}\n`}
        </Text>
      )}
      <Text
        style={buttonTextStyle}
        numberOfLines={5}
        ellipsizeMode="tail"
        lineBreakStrategyIOS="standard">
        {props.comment.data.contents}
      </Text>
      <Text
        style={[
          buttonTextStyle,
          { marginTop: 5, color: config.tokens.colors.primary500 }
        ]}>
        <Icon
          as={MessageCircleIcon}
          color={config.tokens.colors.primary400}
          marginRight={5}
          justifyContent="center"
        />
        {props.comment.data.replyIds.length}
      </Text>
    </Pressable>
  );
}
