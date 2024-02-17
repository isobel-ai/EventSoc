import { Text } from "@gluestack-ui/themed";
import { useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react";
import ScreenView from "../components/general/ScreenView";
import { useUserContext } from "../contexts/UserContext";
import { NotificationData } from "../../../Shared/models/Notification";
import { retrieveUserNotifications } from "../services/user/userNotificationsService";
import { FlatList } from "react-native";
import NotificationListButton from "../components/notification/NotificationListButton";
import { useNotificationContext } from "../contexts/NotificationContext";
import ErrorAlert from "../components/error/ErrorAlert";
import { isUndefined } from "lodash";

export default function NotificationScreen() {
  const { userId } = useUserContext();
  const { setUnreadNotifCount, setCountDisabled } = useNotificationContext();

  const [notifications, setNotifications] = useState<NotificationData[]>();
  const [showRetrieveNotifsErr, setShowRetrieveNotifsErr] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    setCountDisabled(isFocused);

    if (isFocused) {
      setUnreadNotifCount(0);

      retrieveUserNotifications(userId)
        .then((notifications) => {
          setNotifications(notifications);
          setShowRetrieveNotifsErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          isUndefined(notifications) && setShowRetrieveNotifsErr(true);
        });
    }
  }, [isFocused]);

  return (
    <ScreenView removeBottomPadding>
      {showRetrieveNotifsErr ? (
        <ErrorAlert
          message="Unable to retrieve notifications. Try again later."
          style={{ marginTop: 10 }}
        />
      ) : (
        !isUndefined(notifications) && (
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <NotificationListButton notification={item} />
            )}
            ListEmptyComponent={
              <Text
                fontSize={"$lg"}
                alignSelf="center">
                No Notifications
              </Text>
            }
            contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
          />
        )
      )}
    </ScreenView>
  );
}
