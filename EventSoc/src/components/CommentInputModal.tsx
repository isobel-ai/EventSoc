import {
  Alert,
  AlertText,
  Button,
  ButtonIcon,
  ButtonText,
  CloseIcon,
  HStack,
  Heading,
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
import { useEffect, useState } from "react";
import { config } from "../../config/gluestack-ui.config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { postComment } from "../services/eventCommentService";
import { useAppContext } from "../contexts/AppContext";
import { postReply } from "../services/commentsService";

interface Props {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;

  parentType: "EVENT" | "COMMENT";
  parentId: string;
  authorId: string;
}

export default function CommentInputModal(props: Props) {
  const { updateEvents } = useAppContext();

  const [comment, setComment] = useState<string>("");

  const [postCommentErrMsg, setPostCommentErrMsg] = useState<string>("");

  useEffect(() => setComment(""), [props.showModal]);

  const handlePostComment = () => {
    const postAttempt =
      props.parentType === "EVENT"
        ? postComment(props.parentId, props.authorId, comment).then(() =>
            updateEvents().catch()
          )
        : postReply(props.parentId, props.authorId, comment);

    postAttempt
      .then(() => props.setShowModal(false))
      .catch((err) => setPostCommentErrMsg(err.message));
  };

  return (
    <Modal
      isOpen={props.showModal}
      onClose={() => props.setShowModal(false)}>
      <ModalBackdrop />
      <ModalContent
        height="42%"
        top={-97}>
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
          <Textarea minHeight={postCommentErrMsg ? "106%" : "103%"}>
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
                onPress={() => props.setShowModal(false)}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                action="positive"
                size="lg"
                onPress={handlePostComment}>
                <ButtonText>Post</ButtonText>
              </Button>
            </HStack>
            {postCommentErrMsg && (
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
                <AlertText>{postCommentErrMsg}</AlertText>
                <Button
                  variant="link"
                  onPress={() => setPostCommentErrMsg("")}
                  position="absolute"
                  right={3}
                  top={-5}
                  hitSlop={{ left: 10, bottom: 10 }}>
                  <ButtonIcon
                    as={CloseIcon}
                    color="black"
                    size="lg"
                  />
                </Button>
              </Alert>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
