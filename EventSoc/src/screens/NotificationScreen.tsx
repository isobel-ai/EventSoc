import { AlertText, Alert, Text } from "@gluestack-ui/themed";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import ScreenView from "../components/ScreenView";
import { useAppContext } from "../contexts/AppContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../config/gluestack-ui.config";
import { Notification } from "../../../Models/Notification";
import { retrieveNotifications } from "../services/notificationsService";
import { FlatList } from "react-native";
import NotificationListButton from "../components/NotificationListButton";
import { useNotificationContext } from "../contexts/NotificationContext";

export default function NotificationScreen() {
  const { userId, updateEvents } = useAppContext();
  const { setUnreadNotifCount, setCountDisabled } = useNotificationContext();

  const [notifications, setNotifications] = useState<Notification[]>();
  const [retrieveNotifsErrMsg, setRetrieveNotifsErrMsg] = useState<string>("");

  const isFocused = useIsFocused();

  useEffect(() => {
    setCountDisabled(isFocused);

    if (isFocused) {
      setUnreadNotifCount(0);

      retrieveNotifications(userId)
        .then((notifications) => {
          setNotifications(notifications);
          setRetrieveNotifsErrMsg("");
        })
        .catch(
          (err) =>
            !notifications?.length && setRetrieveNotifsErrMsg(err.message)
        );

      updateEvents().catch(); // events depended on in NotificationListButton
    }
  }, [isFocused]);

  return (
    <ScreenView>
      {retrieveNotifsErrMsg ? (
        <Alert
          action="error"
          variant="outline"
          width="80%"
          alignSelf="center">
          <MaterialIcons
            name="error-outline"
            size={40}
            color={config.tokens.colors.error}
            style={{ paddingRight: 10 }}
          />
          <AlertText>{retrieveNotifsErrMsg}</AlertText>
        </Alert>
      ) : (
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
          style={{ height: "110%" }}
          contentContainerStyle={{ gap: 10, paddingTop: 10 }}
        />
      )}
    </ScreenView>
  );
}
