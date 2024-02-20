import {
  Button,
  ButtonText,
  CloseIcon,
  HStack,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  TextareaInput,
  VStack
} from "@gluestack-ui/themed";
import { useState } from "react";
import { createComment } from "../../services/event/eventCommentsService";
import ErrorAlert from "../error/ErrorAlert";
import { useUserContext } from "../../contexts/UserContext";
import { UserOverview } from "../../../../Shared/models/User";
import {
  createReplyToComment,
  createReplyToReply
} from "../../services/event/eventCommentRepliesService";
import { config } from "../../../config/gluestack-ui.config";

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;

  eventId: string;
  eventOrganiserExec: UserOverview[];
} & (
  | {
      // Comment
      topLevelCommentId?: never;
      ancestorReplyIds?: never[];
      parentReplyId?: never;
    }
  | {
      // Reply to Comment
      topLevelCommentId: string;
      ancestorReplyIds?: never[];
      parentReplyId?: never;
    }
  | {
      // Reply to Reply
      topLevelCommentId: string;
      ancestorReplyIds: string[];
      parentReplyId: string;
    }
);

export default function CommentInputModal(props: Props) {
  const { userId } = useUserContext();
  const isExec = props.eventOrganiserExec.some(
    (member) => member.id === userId
  );

  const [comment, setComment] = useState<string>("");
  const [showPostCommentErr, setShowPostCommentErr] = useState<boolean>(false);

  const handleClose = () => {
    props.setShowModal(false);
    setComment("");
    setShowPostCommentErr(false);
  };

  const handlePostComment = () => {
    (props.topLevelCommentId === undefined
      ? createComment(props.eventId, userId, comment, isExec)
      : props.parentReplyId === undefined
      ? createReplyToComment(
          props.eventId,
          props.topLevelCommentId,
          userId,
          comment,
          isExec
        )
      : createReplyToReply(
          props.eventId,
          props.topLevelCommentId,
          props.parentReplyId,
          props.ancestorReplyIds,
          userId,
          comment,
          isExec
        )
    )
      .then(handleClose)
      .catch((err) => {
        console.error(err.message);
        setShowPostCommentErr(true);
      });
  };

  return (
    <Modal
      isOpen={props.showModal}
      onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent
        height="42%"
        top={-97}
        bgColor={config.tokens.colors.defaultBackgroundLight}>
        <ModalHeader marginBottom={10}>
          <ModalCloseButton
            top={-2}
            right={7}
            position="absolute">
            <Icon
              as={CloseIcon}
              size="xl"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody scrollEnabled={false}>
          <Textarea minHeight={showPostCommentErr ? "106%" : "103%"}>
            <TextareaInput
              placeholder="Enter Comment"
              onChangeText={(t) => setComment(t)}
            />
          </Textarea>
        </ModalBody>
        <ModalFooter>
          <VStack gap={15}>
            <HStack gap={55}>
              <Button
                action="negative"
                size="lg"
                onPress={handleClose}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                action="positive"
                size="lg"
                onPress={handlePostComment}>
                <ButtonText>Post</ButtonText>
              </Button>
            </HStack>
            {showPostCommentErr && (
              <ErrorAlert
                message="Unable to post comment. Try again later."
                width="100%"
              />
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
