import { useState } from "react";
import {
  Button,
  ButtonText,
  HStack,
  Heading,
  VStack
} from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { StyleProp, ViewStyle } from "react-native";
import InterestFollowingList from "./InterestFollowingList";
import SocietyFollowingList from "./SocietyFollowingList";

type Props = {
  interests: string[];
  updateInterests: () => Promise<void>;
};

export default function FollowingLists(props: Props) {
  const [listType, setListType] = useState<"INTERESTS" | "SOCIETIES">(
    "INTERESTS"
  );

  const buttonStyle: StyleProp<ViewStyle> = {
    width: "50%",
    borderRadius: 0,
    borderWidth: 1,
    borderColor: config.tokens.colors.black,
    borderTopWidth: 2,
    borderBottomWidth: 2
  };

  return (
    <VStack
      height="93.5%"
      paddingBottom={10}>
      <Heading
        alignSelf="flex-start"
        paddingLeft={10}>
        Following:
      </Heading>
      <HStack width="100%">
        <Button
          variant="outline"
          style={buttonStyle}
          onPress={() => setListType("INTERESTS")}>
          <ButtonText>Interests</ButtonText>
        </Button>
        <Button
          variant="outline"
          style={buttonStyle}
          onPress={() => setListType("SOCIETIES")}>
          <ButtonText>Societies</ButtonText>
        </Button>
      </HStack>
      {listType === "INTERESTS" ? (
        <InterestFollowingList
          interests={props.interests}
          updateInterests={props.updateInterests}
        />
      ) : (
        <SocietyFollowingList />
      )}
    </VStack>
  );
}
