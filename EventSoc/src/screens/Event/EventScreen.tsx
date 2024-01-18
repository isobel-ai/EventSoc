import {
  Alert,
  AlertText,
  Button,
  ButtonText,
  Text,
  VStack,
  ScrollView
} from "@gluestack-ui/themed";
import EventPost from "../../components/EventPost";
import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { config } from "../../../config/gluestack-ui.config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppContext } from "../../contexts/AppContext";
import { useEffect, useState } from "react";
import {
  eventSignUp,
  withdrawEventSignUp
} from "../../services/userEventService";
import ConfirmDialog from "../../components/ConfirmDialog";
import DismissableToast, {
  DismissableToastHookProps
} from "../../components/DismissableToast";
import useDismissableToast from "../../hooks/useDismissableToast";
import { EventStackParamList } from "../../navigation/CrossTabStackScreens/EventStackScreens";

type Props = StackScreenProps<EventStackParamList, "Event">;

export default function EventScreen(props: Props) {
  const { events, getUser, updateEvents, societies, updateUsers } =
    useAppContext();

  const event = events.find((event) => event.id === props.route.params.eventId);
  const user = getUser();

  const isEventFull = event?.data.capacity
    ? event.data.capacity >= 0 &&
      event.data.capacity <= event.data.attendeeIds.length
    : false;

  const eventOrganiser = event
    ? societies.find((society) => society.id === event?.data.organiserId)
    : undefined;
  const isExec =
    user && eventOrganiser
      ? eventOrganiser.data.exec.includes(user.data.name)
      : false;

  const isSignedUp =
    event && user ? user.data.eventAttendingIds.includes(event.id) : false;

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
    if (event && user) {
      eventSignUp(user.id, event.id)
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
    if (event && user) {
      return withdrawEventSignUp(user.id, event.id)
        .then(() => setSignUpErrMsg(""))
        .then(updateEvents)
        .then(updateUsers)
        .catch();
    }
    throw Error("Unable to withdraw sign-up. Try again later.");
  };

  return (
    <ScreenView extraStyle={{ height: "107%" }}>
      {!event ? (
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
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            gap: 10,
            paddingBottom: 10
          }}>
          <EventPost event={event} />
          <VStack
            width="93%"
            alignItems="flex-start">
            {event.data.description && (
              <Text>
                <Text fontWeight="$bold">Description: </Text>
                <Text>{event.data.description}</Text>
              </Text>
            )}
            {event.data.tags.length > 0 && (
              <Text>
                <Text fontWeight="$bold">Tags: </Text>
                <Text>{event.data.tags.join(", ")}</Text>
              </Text>
            )}
            {isExec && (
              <Text>
                <Text fontWeight="$bold">Sign-ups: </Text>
                <Text>
                  {event.data.attendeeIds.length +
                    (event.data.capacity >= 0 ? `/${event.data.capacity}` : "")}
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
        </ScrollView>
      )}
    </ScreenView>
  );
}
