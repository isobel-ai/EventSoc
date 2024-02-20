import {
  retrieveIsUserFollowingSociety,
  createUserSocietyFollow,
  deleteUserSocietyFollow
} from "../../services/user/userSocietiesFollowingService";
import { useUserContext } from "../../contexts/UserContext";
import { useState, useEffect } from "react";
import useDismissableToast from "../../hooks/useDismissableToast";
import { AddIcon, Button, ButtonIcon, ButtonText } from "@gluestack-ui/themed";
import {
  NavigationProp,
  useIsFocused,
  useNavigation
} from "@react-navigation/native";
import { SocietyStackParamList } from "../../navigation/CrossTabStackScreens/SocietyStackScreens";

type Props = {
  societyId: string;
  isExec: boolean;
};

export default function SocietyScreenBottomButton(props: Props) {
  const { navigate } = useNavigation<NavigationProp<SocietyStackParamList>>();

  const { userId } = useUserContext();

  const [isFollowing, setIsFollowing] = useState<boolean>();

  const updateIsFollowing = () =>
    retrieveIsUserFollowingSociety(userId, props.societyId)
      .then(setIsFollowing)
      .catch((err) => console.error(err.message));

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && !props.isExec && updateIsFollowing();
  }, [isFocused, props.isExec, props.societyId]);

  const showToast = useDismissableToast();

  const handleFollow = () =>
    createUserSocietyFollow(userId, props.societyId)
      .then(updateIsFollowing)
      .catch((err) => {
        console.error(err.message);
        showToast({ title: "Couldn't follow society. Try again later." });
      });

  const handleUnfollow = () =>
    deleteUserSocietyFollow(userId, props.societyId)
      .then(updateIsFollowing)
      .catch((err) => {
        console.error(err.message);
        showToast({ title: "Couldn't unfollow society. Try again later." });
      });

  return (
    <Button
      size="xl"
      placement="absoluteBottom"
      action={props.isExec ? "primary" : isFollowing ? "negative" : "positive"}
      onPress={
        props.isExec
          ? () =>
              navigate("Create Event", {
                organiserId: props.societyId
              })
          : isFollowing
          ? handleUnfollow
          : handleFollow
      }>
      {props.isExec && (
        <ButtonIcon
          as={AddIcon}
          size="xl"
          style={{ marginRight: 5 }}
        />
      )}
      <ButtonText>
        {props.isExec ? "Create Event" : isFollowing ? "Unfollow" : "Follow"}
      </ButtonText>
    </Button>
  );
}
