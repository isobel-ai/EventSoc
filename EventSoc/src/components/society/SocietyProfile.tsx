import {
  Button,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Heading,
  ButtonIcon,
  EditIcon,
  Text,
  VStack
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { SocietyData } from "../../../../Shared/models/Society";
import { config } from "../../config/gluestack-ui.config";
import {
  NavigationProp,
  useIsFocused,
  useNavigation
} from "@react-navigation/native";
import {
  retrieveSocietyData,
  retrieveSocietyImage
} from "../../services/society/societiesService";
import { isUndefined } from "lodash";
import ErrorAlert from "../error/ErrorAlert";
import { SocietyStackParamList } from "../../navigation/CrossTabStackScreens/SocietyStackScreens";

type Props = {
  societyId: string;
  isExec: boolean;
};

export default function SocietyProfile(props: Props) {
  const { navigate } = useNavigation<NavigationProp<SocietyStackParamList>>();

  const [society, setSociety] = useState<SocietyData>();
  const [showRetrieveSocErrMsg, setShowRetrieveSocErrMsg] =
    useState<boolean>(false);

  const [profilePic, setProfilePic] = useState<string>("");

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      retrieveSocietyData(props.societyId)
        .then((newSoc) => {
          setSociety(newSoc);
          setShowRetrieveSocErrMsg(false);
        })
        .catch((err) => {
          console.error(err.message);
          setShowRetrieveSocErrMsg(true);
        });

      retrieveSocietyImage(props.societyId)
        .then(setProfilePic)
        .catch((err) => console.error(err.message));
    }
  }, [props.societyId, isFocused]);

  return (
    <>
      {showRetrieveSocErrMsg ? (
        <ErrorAlert
          message={"Couldn't retrieve society profile. Try again later."}
          style={{ marginVertical: 10 }}
        />
      ) : (
        !isUndefined(society) && (
          <VStack>
            <HStack
              backgroundColor={config.tokens.colors.coolGray200}
              gap={15}
              width="100%"
              height={75}
              paddingHorizontal={15}
              alignItems="center">
              <Avatar size="lg">
                <AvatarFallbackText
                  color={config.tokens.colors.white}
                  fontSize="$lg">
                  {society.name}
                </AvatarFallbackText>
                {profilePic && (
                  <AvatarImage
                    source={{ uri: profilePic }}
                    alt=""
                  />
                )}
              </Avatar>
              <Heading
                fontSize="$2xl"
                numberOfLines={1}>
                {society.name}
              </Heading>
              {props.isExec && (
                <Button
                  size="xl"
                  variant="link"
                  position="absolute"
                  right={15}
                  onPress={() =>
                    navigate("Edit Society", {
                      societyId: props.societyId
                    })
                  }>
                  <ButtonIcon
                    as={EditIcon}
                    size="xl"
                    color={config.tokens.colors.black}
                  />
                </Button>
              )}
            </HStack>
            <Text
              fontSize="$sm"
              backgroundColor={config.tokens.colors.coolGray200}
              width="100%"
              paddingHorizontal={20}
              paddingBottom={10}
              numberOfLines={4}>
              {society.description}
            </Text>
          </VStack>
        )
      )}
    </>
  );
}
