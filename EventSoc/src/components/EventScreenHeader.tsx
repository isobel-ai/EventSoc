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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import useDismissableToast from "../hooks/useDismissableToast";
import { eventSignUp, withdrawEventSignUp } from "../services/userEventService";
import ConfirmDialog from "./ConfirmDialog";
import DismissableToast, {
  DismissableToastHookProps
} from "./DismissableToast";
import EventPost from "./EventPost";
import { config } from "../../config/gluestack-ui.config";
import { Event } from "../models/Event";
import { User } from "../models/User";
import CommentInputModal from "./CommentInputModal";

interface Props {
  event?: Event;
  user?: User;
}

export default function EventScreenHeader(props: Props) {
  const { updateEvents, societies, updateUsers } = useAppContext();

  const isEventFull = props.event?.data.capacity
    ? props.event.data.capacity >= 0 &&
      props.event.data.capacity <= props.event.data.attendeeIds.length
    : false;

  const isExec =
    props.event && props.user
      ? societies
          .find((soc) => soc.id === props.event.data.organiserId)
          ?.data.execIds.includes(props.user.id) ?? false
      : false;

  const isSignedUp =
    props.event && props.user
      ? props.user.data.eventAttendingIds.includes(props.event.id)
      : false;

  const [showWithdrawSignUpDialog, setShowWithdrawSignUpDialog] =
    useState<boolean>(false);

  const [signUpErrMsg, setSignUpErrMsg] = useState<string>("");

  const showSignUpErrToast = useDismissableToast(
    ({ id, close }: DismissableToastHookProps) => (
      <DismissableToast
        id={id}
        close={close}
        title={signUpErrMsg}
      />
    )
  );

  useEffect(() => {
    signUpErrMsg && showSignUpErrToast();
  }, [signUpErrMsg]);

  const signUp = () => {
    if (props.event && props.user) {
      eventSignUp(props.user.id, props.event.id)
        .then((signUpSuccessful) =>
          setSignUpErrMsg(signUpSuccessful ? "" : "Event full")
        )
        .catch((err) => setSignUpErrMsg(err.message))
        .then(updateEvents)
        .then(updateUsers)
        .catch();
    } else {
      setSignUpErrMsg("Unable to sign-up. Try again later.");
    }
  };

  const withdrawSignUp = () => {
    if (props.event && props.user) {
      return withdrawEventSignUp(props.user.id, props.event.id)
        .then(() => setSignUpErrMsg(""))
        .then(updateEvents)
        .then(updateUsers)
        .catch();
    }
    throw Error("Unable to withdraw sign-up. Try again later.");
  };

  const [showPostCommentModal, setShowPostCommentModal] =
    useState<boolean>(false);

  return (
    <>
      {!props.event ? (
        <Alert
          action="error"
          variant="outline"
          width="80%"
          marginTop={20}
          alignSelf="center">
          <MaterialIcons
            name="error-outline"
            size={40}
            color={config.tokens.colors.error}
            style={{ paddingRight: 10 }}
          />
          <AlertText>
            Could not retrieve event details. Try again later.
          </AlertText>
        </Alert>
      ) : (
        <View gap={10}>
          <EventPost event={props.event} />
          <VStack
            paddingHorizontal={15}
            alignItems="flex-start">
            {props.event.data.description && (
              <Text>
                <Text fontWeight="$bold">Description: </Text>
                <Text>{props.event.data.description}</Text>
              </Text>
            )}
            {props.event.data.tags.length > 0 && (
              <Text>
                <Text fontWeight="$bold">Tags: </Text>
                <Text>{props.event.data.tags.join(", ")}</Text>
              </Text>
            )}
            {isExec && (
              <Text>
                <Text fontWeight="$bold">Sign-ups: </Text>
                <Text>
                  {props.event.data.attendeeIds.length +
                    (props.event.data.capacity >= 0
                      ? `/${props.event.data.capacity}`
                      : "")}
                </Text>
              </Text>
            )}
          </VStack>
          <Button
            action={
              isSignedUp ? "negative" : isEventFull ? "secondary" : "positive"
            }
            onPress={
              isSignedUp ? () => setShowWithdrawSignUpDialog(true) : signUp
            }
            isDisabled={!isSignedUp && isEventFull}
            alignSelf="center"
            width="80%">
            <ButtonText>
              {isSignedUp
                ? "Withdraw Sign-up"
                : isEventFull
                ? "Event Full"
                : "Sign-up"}
            </ButtonText>
          </Button>
          <ConfirmDialog
            confirmFunc={withdrawSignUp}
            heading="Withdraw Sign-up?"
            body="Press confirm to withdraw."
            isVisible={showWithdrawSignUpDialog}
            setIsVisible={setShowWithdrawSignUpDialog}
          />
          <VStack
            paddingHorizontal={15}
            marginTop={10}
            alignContent="center">
            <Divider bgColor={config.tokens.colors.eventButtonGray} />
            <Heading alignSelf="flex-start">Comments:</Heading>
            {props.user && props.event && (
              <>
                <Button
                  width="100%"
                  onPress={() => setShowPostCommentModal(true)}>
                  <Icon
                    as={AddIcon}
                    marginRight={5}
                    color="white"
                    size="lg"
                  />
                  <ButtonText>Post Comment</ButtonText>
                </Button>
                <CommentInputModal
                  showModal={showPostCommentModal}
                  setShowModal={setShowPostCommentModal}
                  parentType="EVENT"
                  parentId={props.event.id}
                  authorId={props.user.id}
                />
              </>
            )}
          </VStack>
        </View>
      )}
    </>
  );
}
