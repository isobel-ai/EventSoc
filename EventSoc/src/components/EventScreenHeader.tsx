import {
  AddIcon,
  Button,
  ButtonText,
  Divider,
  Heading,
  Icon,
  Text,
  VStack,
  View
} from "@gluestack-ui/themed";
import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import useDismissableToast from "../hooks/useDismissableToast";
import { eventSignUp, withdrawEventSignUp } from "../services/userEventService";
import ConfirmDialog from "./ConfirmDialog";
import EventPost from "./EventPost";
import { config } from "../../config/gluestack-ui.config";
import { Event } from "../models/Event";
import { User } from "../models/User";
import CommentInputModal from "./CommentInputModal";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { EventsStackParamList } from "../navigation/EventsStackNavigator";
import DeleteEventContext, {
  DeleteEventContent
} from "../contexts/DeleteEventContext";

interface Props {
  event: Event;
  user?: User;
}

export default function EventScreenHeader(props: Props) {
  const { goBack } = useNavigation<NavigationProp<EventsStackParamList>>();

  const { updateEventData, societies, updateSocietyData, updateUserData } =
    useAppContext();

  useEffect(() => {
    updateSocietyData(props.event.data.organiserId).catch();
  }, []);

  const isEventFull =
    props.event.data.capacity >= 0 &&
    props.event.data.capacity <= props.event.data.attendeeIds.length;
  const isExec = props.user
    ? societies
        .find((soc) => soc.id === props.event.data.organiserId)
        ?.data.execIds.includes(props.user.id) ?? false
    : false;

  const isSignedUp = props.user
    ? props.user.data.eventAttendingIds.includes(props.event.id)
    : false;

  const [showWithdrawSignUpDialog, setShowWithdrawSignUpDialog] =
    useState<boolean>(false);

  const [signUpErrMsg, setSignUpErrMsg] = useState<string>("");

  const showSignUpErrToast = useDismissableToast({ title: signUpErrMsg });

  useEffect(() => {
    signUpErrMsg && showSignUpErrToast();
  }, [signUpErrMsg]);

  const doSignUpUpdates = () => {
    updateEventData(props.event.id).catch();
    props.user && updateUserData(props.user.id).catch();
  };

  const signUp = () => {
    if (props.user) {
      eventSignUp(props.user.id, props.event.id)
        .then((signUpSuccessful) =>
          setSignUpErrMsg(signUpSuccessful ? "" : "Event full")
        )
        .then(doSignUpUpdates)
        .catch((err) => setSignUpErrMsg(err.message));
    } else {
      setSignUpErrMsg("Unable to sign-up. Try again later.");
    }
  };

  const withdrawSignUp = () => {
    if (props.user) {
      return withdrawEventSignUp(props.user.id, props.event.id)
        .then(() => setSignUpErrMsg(""))
        .then(doSignUpUpdates);
    }
    throw Error("Unable to withdraw sign-up. Try again later.");
  };

  const [showPostCommentModal, setShowPostCommentModal] =
    useState<boolean>(false);

  useEffect(() => {
    !showPostCommentModal && updateEventData(props.event.id).catch();
  }, [showPostCommentModal]);

  const deleteEventContent: DeleteEventContent = { onDeleteEvent: goBack };

  return (
    <DeleteEventContext.Provider value={deleteEventContent}>
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
          {props.user && (
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
    </DeleteEventContext.Provider>
  );
}
