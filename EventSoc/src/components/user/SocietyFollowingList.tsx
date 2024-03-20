import { useState, useEffect } from "react";
import { Name } from "../../../../Shared/models/Name";
import { FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { retrieveUserSocietiesFollowing } from "../../services/user/userSocietiesFollowingService";
import { useUserContext } from "../../contexts/UserContext";
import { isUndefined } from "lodash";
import ErrorAlert from "../error/ErrorAlert";
import { Text, Divider, Spinner } from "@gluestack-ui/themed";
import SocietyFollowingListButton from "./SocietyFollowingListButton";

export default function SocietyFollowingList() {
  const { userId } = useUserContext();

  const [followedSocs, setFollowedSocs] = useState<Name[]>();
  const [showRetrieveSocsErr, setShowRetrieveSocsErr] =
    useState<boolean>(false);

  const updateFollowedSocs = () =>
    retrieveUserSocietiesFollowing(userId)
      .then((socs) => {
        setFollowedSocs(socs);
        setShowRetrieveSocsErr(false);
      })
      .catch((err) => {
        console.error(err.message);
        isUndefined(followedSocs) && setShowRetrieveSocsErr(true);
      });

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && updateFollowedSocs();
  }, [isFocused]);

  return (
    <>
      {showRetrieveSocsErr ? (
        <ErrorAlert
          message="Couldn't retrieve the societies you follow. Try again later."
          style={{ marginVertical: 10 }}
        />
      ) : (
        <FlatList
          style={{ width: "100%" }}
          data={followedSocs}
          renderItem={({ item }) => (
            <SocietyFollowingListButton
              society={item}
              updateFollowedSocs={updateFollowedSocs}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
          ListFooterComponent={<Divider />}
          ListEmptyComponent={
            isUndefined(followedSocs) ? (
              <Spinner
                size="large"
                marginVertical={15}
              />
            ) : (
              <Text
                fontSize="$lg"
                alignSelf="center"
                paddingVertical={5}>
                You don&apos;t follow any societies
              </Text>
            )
          }
        />
      )}
    </>
  );
}
