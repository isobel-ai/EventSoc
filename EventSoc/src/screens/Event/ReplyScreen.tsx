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
  Heading,
  Icon,
  Text,
  VStack,
  View
} from "@gluestack-ui/themed";
import { useAppContext } from "../../contexts/AppContext";
import React, { useEffect, useRef, useState } from "react";
import {
  retrieveCommentData,
  retrieveReplies,
  retrieveReplyAncestry
} from "../../services/commentsService";
import { Comment } from "../../models/Comment";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../../config/gluestack-ui.config";
import CommentButton from "../../components/CommentButton";
import CommentInputModal from "../../components/CommentInputModal";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, FlatList, Dimensions } from "react-native";

type Props = StackScreenProps<EventStackParamList, "Reply">;

export default function ReplyScreen(props: Props) {
  const { userId } = useAppContext();

  const [commentAncestry, setCommentAncestry] = useState<Comment[]>([]);
  const [comment, setComment] = useState<Comment>();
  const [replies, setReplies] = useState<Comment[]>([]);

  const [retrieveComAncErrMsg, setRetrieveComAncErrMsg] = useState<string>("");
  const [retrieveCommentErrMsg, setRetrieveCommentErrMsg] =
    useState<string>("");
  const [retrieveRepliesErrMsg, setRetrieveRepliesErrMsg] =
    useState<string>("");

  const [comAndRepsHeight, setComAndRepsHeight] = useState<number>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [showPostCommentModal, setShowPostCommentModal] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!showPostCommentModal && isFocused) {
      retrieveCommentData(props.route.params.commentId)
        .then((newCommentData) =>
          setComment({ id: props.route.params.commentId, data: newCommentData })
        )
        .then(() => setRetrieveCommentErrMsg(""))
        .catch((err) => !comment && setRetrieveCommentErrMsg(err.message));

      retrieveReplies(props.route.params.commentId)
        .then((newReplies) => setReplies(newReplies))
        .then(() => setRetrieveRepliesErrMsg(""))
        .catch(
          (err) => !replies.length && setRetrieveRepliesErrMsg(err.message)
        );
    }
  }, [isFocused, showPostCommentModal]);

  useEffect(() => {
    isFocused &&
      retrieveReplyAncestry(props.route.params.commentId).then(
        (newAncestory) => {
          setCommentAncestry(newAncestory.ancestry.reverse());
          setRetrieveComAncErrMsg(newAncestory.error?.message ?? "");
        }
      );
  }, [isFocused]);

  const CommentAncestorDivider = () => (
    <Divider
      orientation="vertical"
      height="$5"
      bgColor="black"
      marginHorizontal={20}
      width="$1"
    />
  );

  return (
    <ScreenView extraStyle={{ height: "107%" }}>
      <ScrollView
        ref={scrollViewRef}
        maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
        contentContainerStyle={{ paddingTop: 10 }}>
        {retrieveComAncErrMsg && (
          <Alert
            action="error"
            variant="outline"
            width="93%"
            alignSelf="center"
            marginBottom={10}>
            <MaterialIcons
              name="error-outline"
              size={40}
              color={config.tokens.colors.error}
              style={{ paddingRight: 15 }}
            />
            <AlertText>{retrieveComAncErrMsg}</AlertText>
          </Alert>
        )}
        <FlatList
          scrollEnabled={false}
          data={commentAncestry}
          renderItem={({ item }) => (
            <CommentButton
              comment={item}
              eventOrganiserId={props.route.params.eventOrganiserId}
            />
          )}
          ItemSeparatorComponent={() => <CommentAncestorDivider />}
        />
        {commentAncestry.length > 0 && <CommentAncestorDivider />}
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 10, gap: 10 }}
          data={replies}
          renderItem={({ item }) => (
            <CommentButton
              comment={item as Comment}
              eventOrganiserId={props.route.params.eventOrganiserId}
            />
          )}
          ListHeaderComponent={
            <VStack
              gap={5}
              alignContent="center">
              {!retrieveCommentErrMsg ? (
                comment && (
                  <CommentButton
                    comment={comment}
                    eventOrganiserId={props.route.params.eventOrganiserId}
                    disableButton
                  />
                )
              ) : (
                <Alert
                  action="error"
                  variant="outline"
                  width="93%"
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
                onPress={() => setShowPostCommentModal(true)}
                isDisabled={Boolean(retrieveRepliesErrMsg)}>
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
          ListEmptyComponent={
            retrieveRepliesErrMsg ? (
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
          onLayout={({
            nativeEvent: {
              layout: { height }
            }
          }) => setComAndRepsHeight(height)}
        />
        <View
          height={
            comAndRepsHeight &&
            comAndRepsHeight < Dimensions.get("screen").height - 100
              ? Dimensions.get("screen").height - 100 - comAndRepsHeight
              : undefined
          }
        />
      </ScrollView>
    </ScreenView>
  );
}
