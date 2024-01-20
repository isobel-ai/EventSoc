import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";
import EventScreenHeader from "../../components/EventScreenHeader";
import {
  Alert,
  AlertText,
  Button,
  FlatList,
  ButtonText,
  Text
} from "@gluestack-ui/themed";
import { useAppContext } from "../../contexts/AppContext";
import React, { useEffect, useState } from "react";
import { retrieveComments } from "../../services/commentsService";
import { Comment } from "../../models/Comment";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../../config/gluestack-ui.config";
import CommentButton from "../../components/CommentButton";

type Props = StackScreenProps<EventStackParamList, "Event">;

export default function EventScreen(props: Props) {
  const { events, userId, users } = useAppContext();

  const event = events.find((event) => event.id === props.route.params.eventId);
  const user = users.find((user) => user.id === userId);

  const [comments, setComments] = useState<Comment[]>([]);

  const [showRetrieveCommentError, setShowRetrieveCommentError] =
    useState<boolean>(false);

  useEffect(() => {
    if (event) {
      retrieveComments(event.data.commentIds)
        .then((newComments) => setComments(newComments.reverse()))
        .then(() => setShowRetrieveCommentError(false))
        .catch(() => setShowRetrieveCommentError(true));
    }
  }, [event]);

  return (
    <ScreenView extraStyle={{ height: "107%" }}>
      <FlatList
        ListHeaderComponent={<EventScreenHeader {...{ event, user }} />}
        data={comments}
        renderItem={({ item }) => <CommentButton comment={item as Comment} />}
        ListEmptyComponent={
          showRetrieveCommentError ? (
            <Alert
              action="error"
              variant="outline"
              width="95%"
              alignSelf="center">
              <MaterialIcons
                name="error-outline"
                size={40}
                color={config.tokens.colors.error}
                style={{ paddingRight: 15 }}
              />
              <AlertText>
                Couldn't retrieve comments. Try again later.
              </AlertText>
            </Alert>
          ) : (
            <Text
              fontSize={"$lg"}
              alignSelf="center"
              marginTop={-10}>
              No Comments
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 10, gap: 10 }}
      />
    </ScreenView>
  );
}
