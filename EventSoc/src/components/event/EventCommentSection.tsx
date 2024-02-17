import {
  VStack,
  Text,
  Heading,
  Icon,
  AddIcon,
  ButtonText,
  Button
} from "@gluestack-ui/themed";
import { useIsFocused } from "@react-navigation/native";
import { isUndefined } from "lodash";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { retrieveComments } from "../../services/event/eventCommentsService";
import CommentButton from "../comment/CommentButton";
import CommentInputModal from "../comment/CommentInputModal";
import { UserOverview } from "../../../../Shared/models/User";
import { CommentDoc } from "../../../../Shared/models/CommentOrReply";
import ErrorAlert from "../error/ErrorAlert";
import { config } from "../../../config/gluestack-ui.config";

type Props = {
  eventId: string;
  eventOrganiserExec?: UserOverview[];
};

export default function EventCommentSection(props: Props) {
  const [comments, setComments] = useState<CommentDoc[]>();
  const [showRetrieveCommentErr, setShowRetrieveCommentErr] =
    useState<boolean>(false);

  const [showPostCommentModal, setShowPostCommentModal] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      !showPostCommentModal &&
      retrieveComments(props.eventId)
        .then((newComments) => {
          setComments(newComments);
          setShowRetrieveCommentErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          isUndefined(comments) && setShowRetrieveCommentErr(true);
        });
  }, [isFocused, showPostCommentModal]);

  return (
    <FlatList
      scrollEnabled={false}
      contentContainerStyle={{ paddingBottom: 10, gap: 10 }}
      ListHeaderComponent={
        <VStack
          paddingHorizontal={10}
          alignContent="center">
          <Heading alignSelf="flex-start">Comments:</Heading>
          <Button
            width="100%"
            onPress={() => setShowPostCommentModal(true)}
            isDisabled={isUndefined(props.eventOrganiserExec)}>
            <Icon
              as={AddIcon}
              marginRight={5}
              color={config.tokens.colors.white}
              size="lg"
            />
            <ButtonText>Post Comment</ButtonText>
          </Button>
          {!isUndefined(props.eventOrganiserExec) && (
            <CommentInputModal
              showModal={showPostCommentModal}
              setShowModal={setShowPostCommentModal}
              eventId={props.eventId}
              eventOrganiserExec={props.eventOrganiserExec}
            />
          )}
        </VStack>
      }
      data={comments}
      renderItem={({ item }) => (
        <CommentButton
          eventId={props.eventId}
          comment={item}
        />
      )}
      ListEmptyComponent={
        showRetrieveCommentErr ? (
          <ErrorAlert message="Couldn't retrieve comments. Try again later." />
        ) : (
          <Text
            fontSize={"$lg"}
            alignSelf="center"
            marginTop={-5}>
            No Comments
          </Text>
        )
      }
    />
  );
}
