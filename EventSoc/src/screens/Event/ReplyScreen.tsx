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
import React, { useEffect, useRef, useState } from "react";
import {
  retrieveCommentData,
  retrieveComments,
  retrieveReplies,
  retrieveReplyAncestry
} from "../../services/commentsService";
import { Comment, CommentData } from "../../models/Comment";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../../config/gluestack-ui.config";
import CommentButton from "../../components/CommentButton";
import CommentInputModal from "../../components/CommentInputModal";
import { useIsFocused } from "@react-navigation/native";
import { SectionList } from "react-native";

type Props = StackScreenProps<EventStackParamList, "Reply">;

export default function ReplyScreen(props: Props) {
  const { userId } = useAppContext();

  const [commentAncestry, setCommentAncestry] = useState<(Comment | Error)[]>(
    []
  );
  const [replies, setReplies] = useState<(Comment | Error)[]>([]);

  const [showPostCommentModal, setShowPostCommentModal] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  const sectionListRef = useRef<SectionList>(null);

  useEffect(() => {
    isFocused &&
      retrieveReplyAncestry(props.route.params.commentId).then((newAncestory) =>
        setCommentAncestry(newAncestory.reverse())
      );
  }, [isFocused]);

  useEffect(() => {
    !showPostCommentModal &&
      commentAncestry.length &&
      retrieveCommentData(props.route.params.commentId)
        .then((newCommentData) => {
          setCommentAncestry(
            commentAncestry.splice(commentAncestry.length - 1, 1, {
              id: props.route.params.commentId,
              data: newCommentData
            })
          );
        })
        .catch();
  }, [showPostCommentModal]);

  useEffect(() => {
    retrieveReplies(props.route.params.commentId)
      .then((newReplies) => setReplies(newReplies))
      .catch((err) => !replies.length && setReplies([Error(err)]));
  }, [commentAncestry.at(-1)]);

  // Fix when loading is added
  useEffect(() => {
    commentAncestry.length &&
      sectionListRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: commentAncestry.length - 1
      });
  }, [commentAncestry.length]);

  return (
    <ScreenView extraStyle={{ height: "107%" }}>
      <SectionList
        ref={sectionListRef}
        sections={[
          { title: "ancestors", data: commentAncestry },
          { title: "replies", data: replies }
        ]}
        renderItem={({ item }) => {
          const comment = item as Comment;
          return (
            <CommentButton
              comment={comment}
              eventOrganiserId={props.route.params.eventOrganiserId}
              disableButton={comment.id === props.route.params.commentId}
            />
          );
        }}
        onScrollToIndexFailed={() => console.log("fail")}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section: { title } }) =>
          title === "replies" ? (
            <VStack
              backgroundColor={config.tokens.colors.backgroundLight100}
              gap={5}
              paddingBottom={10}
              alignContent="center">
              <Divider
                alignSelf="center"
                width="95%"
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
          ) : (
            <></>
          )
        }
        style={{ marginTop: 10 }}
        contentContainerStyle={{ paddingBottom: 10, gap: 10 }}
      />
    </ScreenView>
  );
}
