import { Button, ButtonText, Text, VStack } from "@gluestack-ui/themed";
import { useState, useEffect } from "react";
import { useUserContext } from "../../contexts/UserContext";
import useDismissableToast from "../../hooks/useDismissableToast";
import ConfirmDialog from "../general/ConfirmDialog";
import { EventDoc } from "../../../../Shared/models/Event";
import { useIsFocused } from "@react-navigation/native";
import {
  createEventAttendee,
  deleteEventAttendee,
  retrieveIsUserEventAttendee
} from "../../services/event/eventAttendeesService";
import { isUndefined } from "lodash";
import ErrorAlert from "../error/ErrorAlert";
import useTicketing from "../../hooks/useTicketing";
import {
  reserveTicket,
  unreserveTicket
} from "../../services/event/eventsService";
import { PaymentSheetError } from "@stripe/stripe-react-native";

type Props = {
  event: EventDoc;
  updateEvent: () => Promise<void>;
};

export default function EventSignUp(props: Props) {
  const { userId } = useUserContext();
  const isExec = props.event.data.organiser.exec.some(
    (member) => member.id === userId
  );

  const isEventFull =
    props.event.data.capacity >= 0 &&
    props.event.data.attendance >= props.event.data.capacity;

  const isEventPaid = Boolean(props.event.data.ticketPrice);

  const isEventUpcoming = props.event.data.endDate > new Date();

  const [isSignedUp, setIsSignedUp] = useState<boolean>();
  const [showRetreiveIsSignedUpErr, setShowRetrieveIsSignedUpErr] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  const updateComponent = () =>
    Promise.allSettled([
      props.updateEvent(),

      retrieveIsUserEventAttendee(userId, props.event.id)
        .then((isSignedUp) => {
          setIsSignedUp(isSignedUp);
          setShowRetrieveIsSignedUpErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          setShowRetrieveIsSignedUpErr(true);
        })
    ]);

  useEffect(() => {
    isFocused && updateComponent();
  }, [isFocused]);

  const { buyTicket } = useTicketing(
    props.event.data.organiser.name,
    props.event.data.ticketPrice
  );

  const signUp = () => {
    if (props.event.data.ticketPrice) {
      reserveTicket(props.event.id)
        .then(buyTicket)
        .then(() => createEventAttendee(props.event.id, userId, true))
        .then(handleSignUpSuccess)
        .catch((err) => {
          err.code !== PaymentSheetError.Canceled && handleSignUpError(err);
          unreserveTicket(props.event.id).catch((err) =>
            console.error(err.message)
          );
        });
    } else {
      createEventAttendee(props.event.id, userId)
        .then(handleSignUpSuccess)
        .catch(handleSignUpError);
    }
  };

  const showSignUpResultToast = useDismissableToast();

  const handleSignUpSuccess = () =>
    updateComponent().then(
      showSignUpResultToast({
        title: `You are signed up for ${props.event.data.name}`,
        action: "success"
      })
    );

  const handleSignUpError = (err: any) => {
    console.error(err.message);
    showSignUpResultToast({
      title:
        err.message === "Event Full."
          ? "Event Full."
          : "Unable to sign-up. Try again later."
    });
  };

  const [showWithdrawSignUpDialog, setShowWithdrawSignUpDialog] =
    useState<boolean>(false);

  const withdrawSignUp = () =>
    deleteEventAttendee(props.event.id, userId)
      .then(updateComponent)
      .then(() =>
        showSignUpResultToast({
          title: `You have withdrawn from ${props.event.data.name}`
        })
      )
      .catch((err) => {
        console.error(err.message);
        throw Error("Unable to withdraw sign-up. Try again later.");
      });

  return (
    <VStack gap={10}>
      {isExec && (
        <Text
          alignSelf="flex-start"
          paddingLeft={10}>
          <Text fontWeight="$bold">Sign-ups: </Text>
          <Text>
            {`${props.event.data.attendance}${
              props.event.data.capacity >= 0
                ? `/${props.event.data.capacity}`
                : ``
            }`}
          </Text>
        </Text>
      )}
      <Text
        alignSelf="flex-start"
        paddingLeft={10}>
        <Text fontWeight="$bold">Ticket Price: </Text>
        <Text>
          {props.event.data.ticketPrice
            ? `£${props.event.data.ticketPrice.toFixed(2)}`
            : "Free"}
        </Text>
      </Text>
      {isEventUpcoming &&
        (showRetreiveIsSignedUpErr ? (
          <ErrorAlert message="Couldn't retrieve your sign-up status. Try again later." />
        ) : (
          !isUndefined(isSignedUp) && (
            <Button
              action={
                isSignedUp
                  ? isEventPaid
                    ? "secondary"
                    : "negative"
                  : isEventFull
                  ? "secondary"
                  : "positive"
              }
              onPress={
                isSignedUp ? () => setShowWithdrawSignUpDialog(true) : signUp
              }
              isDisabled={
                (!isSignedUp && isEventFull) || (isSignedUp && isEventPaid)
              }
              alignSelf="center"
              width="80%">
              <ButtonText>
                {isSignedUp
                  ? isEventPaid
                    ? "Signed-Up"
                    : "Withdraw Sign-up"
                  : isEventFull
                  ? "Event Full"
                  : "Sign-up"}
              </ButtonText>
            </Button>
          )
        ))}
      <ConfirmDialog
        confirmFunc={withdrawSignUp}
        heading="Withdraw Sign-up?"
        body="Press confirm to withdraw."
        isVisible={showWithdrawSignUpDialog}
        setIsVisible={setShowWithdrawSignUpDialog}
      />
    </VStack>
  );
}
