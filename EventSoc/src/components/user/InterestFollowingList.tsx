import { FlatList, Keyboard } from "react-native";
import { Divider, Input, InputField, Text } from "@gluestack-ui/themed";
import { useUserContext } from "../../contexts/UserContext";
import { useState } from "react";
import { config } from "../../config/gluestack-ui.config";
import {
  createUserInterest,
  deleteUserInterest
} from "../../services/user/usersService";
import useDismissableToast from "../../hooks/useDismissableToast";
import InterestListButton from "./InterestListButtton";

type Props = {
  interests: string[];
  updateInterests: () => Promise<void>;
};

export default function InterestFollowingList(props: Props) {
  const { userId } = useUserContext();

  const sortedInterests = props.interests.sort((a, b) => a.localeCompare(b));

  const [newInterest, setNewInterest] = useState<string>("");

  const showToast = useDismissableToast();

  const handleAddInterest = () => {
    createUserInterest(userId, newInterest)
      .then(() => {
        setNewInterest("");
        props.updateInterests();
        Keyboard.dismiss();
      })
      .catch((err) => {
        console.error(err.message);
        showToast({ title: "Couldn't add interest. Try again later." });
      });
  };

  const handleDeleteInterest = (interest: string) => {
    deleteUserInterest(userId, interest)
      .then(() => {
        props.updateInterests();
      })
      .catch((err) => {
        console.error(err.message);
        showToast({ title: "Couldn't remove interest. Try again later." });
      });
  };

  return (
    <FlatList
      style={{ width: "100%" }}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={
        <Input
          borderRadius="$none"
          borderColor={config.tokens.colors.black}
          borderTopWidth="$0"
          borderBottomWidth="$2"
          bgColor={config.tokens.colors.defaultBackgroundLight}>
          <InputField
            value={newInterest}
            placeholder="Press Enter to Add an Interest"
            onChangeText={(t) => setNewInterest(t)}
            onSubmitEditing={handleAddInterest}
          />
        </Input>
      }
      data={sortedInterests}
      renderItem={({ item }) => (
        <InterestListButton
          interest={item}
          deleteInterest={() => handleDeleteInterest(item)}
        />
      )}
      ItemSeparatorComponent={() => <Divider />}
      ListFooterComponent={<Divider />}
      ListEmptyComponent={
        <Text
          fontSize="$lg"
          alignSelf="center"
          marginVertical={10}>
          No Interests
        </Text>
      }
    />
  );
}
