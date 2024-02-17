import { Button, ButtonText, Heading } from "@gluestack-ui/themed";
import ScreenView from "../components/general/ScreenView";
import { useEffect, useState } from "react";
import { signOut } from "../services/authService";
import { useUserContext } from "../contexts/UserContext";
import { useIsFocused } from "@react-navigation/native";
import { UserData } from "../../../Shared/models/User";
import { retrieveUserData } from "../services/user/usersService";
import { isUndefined } from "lodash";
import ErrorAlert from "../components/error/ErrorAlert";
import useDismissableToast from "../hooks/useDismissableToast";
import FollowingLists from "../components/user/FollowingLists";

export default function MyAccountScreen() {
  const { userId } = useUserContext();

  const [user, setUser] = useState<UserData>();
  const [showRetrieveUserErr, setShowRetrieveUserErr] =
    useState<boolean>(false);

  const updateUser = () =>
    retrieveUserData(userId)
      .then((newUser) => {
        setUser(newUser);
        setShowRetrieveUserErr(false);
      })
      .catch((err) => {
        console.error(err.message);
        isUndefined(user) && setShowRetrieveUserErr(true);
      });

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && updateUser();
  }, [isFocused]);

  const showSignOutErrToast = useDismissableToast();

  const handleSignOut = () =>
    signOut().catch((err) => {
      console.error(err.message);
      showSignOutErrToast({ title: "Unable to logout. Try again later." });
    });

  return (
    <ScreenView>
      {showRetrieveUserErr ? (
        <ErrorAlert
          message="Couldn't retrieve your profile. Try again later."
          style={{ marginVertical: 10 }}
        />
      ) : (
        !isUndefined(user) && (
          <>
            <Heading textAlign="center">{`Hi ${user.name}!`}</Heading>
            <FollowingLists
              interests={user.interests}
              updateInterests={updateUser}
            />
          </>
        )
      )}
      <Button
        action="negative"
        size="xl"
        placement="absoluteBottom"
        onPress={handleSignOut}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </ScreenView>
  );
}
