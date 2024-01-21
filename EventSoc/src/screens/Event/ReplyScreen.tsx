import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";
import {
  AddIcon,
  Alert,
  AlertText,
  Button,
  ButtonText,
  Divider,
  FlatList,
  Heading,
  Icon,
  Text,
  VStack
} from "@gluestack-ui/themed";
import { useAppContext } from "../../contexts/AppContext";
import React, { useEffect, useState } from "react";
import {
  retrieveCommentData,
  retrieveComments
} from "../../services/commentsService";
import { Comment, CommentData } from "../../models/Comment";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../../config/gluestack-ui.config";
import CommentButton from "../../components/CommentButton";
import CommentInputModal from "../../components/CommentInputModal";
import { useIsFocused } from "@react-navigation/native";

type Props = StackScreenProps<EventStackParamList, "Reply">;

export default function ReplyScreen(props: Props) {
  const { userId } = useAppContext();

  const [comment, setComment] = useState<CommentData>();
  const [replies, setReplies] = useState<Comment[]>([]);

  const [retrieveCommentErrMsg, setRetrieveCommentErrMsg] =
    useState<string>("");
  const [retrieveRepliesErrMsg, setRetrieveRepliesErrMsg] =
    useState<string>("");

  const [showPostCommentModal, setShowPostCommentModal] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    !showPostCommentModal &&
      isFocused &&
      retrieveCommentData(props.route.params.commentId)
        .then((newComment) => setComment(newComment))
        .then(() => setRetrieveCommentErrMsg(""))
        .catch((err) => !comment && setRetrieveCommentErrMsg(err.message));
  }, [showPostCommentModal, isFocused]);

  useEffect(() => {
    comment &&
      retrieveComments(comment.replyIds, true)
        .then((newReplies) => setReplies(newReplies))
        .then(() => setRetrieveRepliesErrMsg(""))
        .catch(
          (err) => !replies.length && setRetrieveRepliesErrMsg(err.message)
        );
  }, [comment]);

  return (
    <ScreenView extraStyle={{ height: "107%" }}>
      <FlatList
        ListHeaderComponent={
          <VStack
            gap={5}
            marginTop={10}
            alignContent="center">
            {!retrieveCommentErrMsg ? (
              comment && (
                <CommentButton
                  comment={{ id: props.route.params.commentId, data: comment }}
                  eventOrganiserId={props.route.params.eventOrganiserId}
                  disableButton
                />
              )
            ) : (
              <Alert
                action="error"
                variant="outline"
                width="100%"
                alignSelf="center">
                <MaterialIcons
                  name="error-outline"
                  size={40}
                  color={config.tokens.colors.error}
                  style={{ paddingRight: 15 }}
                />
                <AlertText>{retrieveCommentErrMsg}</AlertText>
              </Alert>
            )}
            <Divider
              alignSelf="center"
              width="95%"
              marginTop={5}
              marginBottom={-5}
              bgColor={config.tokens.colors.eventButtonGray}
            />
            <Heading
              alignSelf="flex-start"
              paddingHorizontal={15}>
              Replies:
            </Heading>
            <Button
              width="93%"
              onPress={() => setShowPostCommentModal(true)}>
              <Icon
                as={AddIcon}
                marginRight={5}
                color="white"
                size="lg"
              />
              <ButtonText>Post Reply</ButtonText>
            </Button>
            <CommentInputModal
              showModal={showPostCommentModal}
              setShowModal={setShowPostCommentModal}
              parentType="COMMENT"
              parentId={props.route.params.commentId}
              authorId={userId}
            />
          </VStack>
        }
        data={replies}
        renderItem={({ item }) => (
          <CommentButton
            comment={item as Comment}
            eventOrganiserId={props.route.params.eventOrganiserId}
          />
        )}
        ListEmptyComponent={
          retrieveCommentErrMsg ? undefined : retrieveRepliesErrMsg ? (
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
              <AlertText>{retrieveRepliesErrMsg}</AlertText>
            </Alert>
          ) : (
            <Text
              fontSize={"$lg"}
              alignSelf="center">
              No Replies
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 10, gap: 10 }}
      />
    </ScreenView>
  );
}
