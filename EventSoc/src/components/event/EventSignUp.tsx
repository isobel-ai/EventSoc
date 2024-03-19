import { Button, ButtonText, Text, VStack } from "@gluestack-ui/themed";
import { useState, useEffect } from "react";
import { useUserContext } from "../../contexts/UserContext";
import useDismissableToast from "../../hooks/useDismissableToast";
import ConfirmDialog from "../general/ConfirmDialog";
import { config } from "../../../config/gluestack-ui.config";
import { EventDoc } from "../../../../Shared/models/Event";
import { useIsFocused } from "@react-navigation/native";
import {
  createEventAttendee,
  deleteEventAttendee,
  retrieveEventAttendeeCount,
  retrieveIsUserEventAttendee
} from "../../services/event/eventAttendeesService";
import { isUndefined } from "lodash";
import ErrorAlert from "../error/ErrorAlert";

type Props = {
  event: EventDoc;
  updateEvent: () => Promise<void>;
};

export default function EventSignUp(props: Props) {
  const { userId } = useUserContext();
  const isExec = props.event.data.organiser.exec.some(
    (member) => member.id === userId
  );

  const [numOfAttendees, setNumOfAttendees] = useState<number>();
  const [showRetrieveNumOfAttendeesErr, setShowRetrieveNumOfAttendeesErr] =
    useState<boolean>(false);

  const isEventFull =
    props.event.data.capacity >= 0 &&
    !isUndefined(numOfAttendees) &&
    props.event.data.capacity <= numOfAttendees;

  const [isSignedUp, setIsSignedUp] = useState<boolean>();
  const [showRetreiveIsSignedUpErr, setShowRetrieveIsSignedUpErr] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  const updateComponent = () =>
    Promise.allSettled([
      props.updateEvent(),

      retrieveEventAttendeeCount(props.event.id)
        .then((count) => {
          setNumOfAttendees(count);
          setShowRetrieveNumOfAttendeesErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          setShowRetrieveNumOfAttendeesErr(true);
        }),

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

  const showSignUpErrToast = useDismissableToast();

  const signUp = () => {
    updateComponent()
      .then(async () => {
        if (isUndefined(numOfAttendees)) {
          throw Error;
        }

        if (
          props.event.data.capacity >= 0 &&
          props.event.data.capacity <= numOfAttendees
        ) {
          showSignUpErrToast({ title: "Event Full" });
        } else {
          await createEventAttendee(props.event.id, userId).then(
            updateComponent
          );
        }
      })
      .catch((err) => {
        console.error(err.message);
        showSignUpErrToast({ title: "Unable to sign-up. Try again later." });
      });
  };

  const [showWithdrawSignUpDialog, setShowWithdrawSignUpDialog] =
    useState<boolean>(false);

  const withdrawSignUp = () =>
    deleteEventAttendee(props.event.id, userId)
      .then(updateComponent)
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
          {showRetrieveNumOfAttendeesErr ? (
            <Text color={config.tokens.colors.error}>
              Could not retrieve sign-up information. Try again later.
            </Text>
          ) : (
            !isUndefined(numOfAttendees) && (
              <Text color={config.tokens.colors.black}>
                {`${numOfAttendees}${
                  props.event.data.capacity >= 0
                    ? `/${props.event.data.capacity}`
                    : ``
                }`}
              </Text>
            )
          )}
        </Text>
      )}
      <Text
        alignSelf="flex-start"
        paddingLeft={10}>
        <Text fontWeight="$bold">Ticket Price: </Text>
        <Text>
          {props.event.data.ticketPrice
            ? `£${props.event.data.ticketPrice}`
            : "Free"}
        </Text>
      </Text>
      {showRetreiveIsSignedUpErr ? (
        <ErrorAlert message="Couldn't retrieve your sign-up status. Try again later." />
      ) : (
        !isUndefined(isSignedUp) && (
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
        )
      )}
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
