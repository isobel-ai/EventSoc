import {
  HStack,
  ButtonIcon,
  CloseCircleIcon,
  Button
} from "@gluestack-ui/themed";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Name } from "../../../../Shared/models/Name";
import useDismissableToast from "../../hooks/useDismissableToast";
import { SocietyStackParamList } from "../../navigation/CrossTabStackScreens/SocietyStackScreens";
import { deleteUserSocietyFollow } from "../../services/user/userSocietiesFollowingService";
import SocietyListButton from "../society/SocietyListButton";
import { useUserContext } from "../../contexts/UserContext";
import { config } from "../../config/gluestack-ui.config";

type Props = {
  society: Name;
  updateFollowedSocs: () => void;
};

export default function SocietyFollowingListButton(props: Props) {
  const { navigate } = useNavigation<NavigationProp<SocietyStackParamList>>();

  const { userId } = useUserContext();

  const showToast = useDismissableToast();

  const handleUnfollow = () =>
    deleteUserSocietyFollow(userId, props.society.id)
      .then(props.updateFollowedSocs)
      .catch((err) => {
        console.error(err.message);
        showToast({ title: "Couldn't unfollow society. Try again later." });
      });

  return (
    <HStack
      paddingVertical={5}
      alignItems="center">
      <SocietyListButton
        society={props.society}
        onPress={() => navigate("Society", { societyId: props.society.id })}
      />
      <Button
        variant="link"
        position="absolute"
        right={15}
        onPress={handleUnfollow}>
        <ButtonIcon
          as={CloseCircleIcon}
          color={config.tokens.colors.error}
          size="xl"
        />
      </Button>
    </HStack>
  );
}
