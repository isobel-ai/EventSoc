import { useState, useRef, useEffect, ReactNode } from "react";
import { NotificationPayload } from "../../../Shared/models/Notification";
import {
  registerForPushNotifications,
  updateBadgeCount
} from "../services/expoNotificationsService";
import { createUserNotification } from "../services/user/userNotificationsService";
import {
  createUserNotificationToken,
  deleteUserNotificationToken
} from "../services/user/usersService";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { MainTabParamList } from "../navigation/MainTabNavigator";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import NotificationContext from "../contexts/NotificationContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: Platform.OS === "android"
  })
});

type Props = {
  loggedIn?: boolean;
  userId: string;
  children: ReactNode;
};

export default function NotificationProvider(props: Props) {
  const { navigate } =
    useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const [notifToken, setNotifToken] = useState<string>();

  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [countDisabled, setCountDisabled] = useState<boolean>(false);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (props.loggedIn) {
      registerForPushNotifications()
        .then((token) => {
          setNotifToken(token);
          token !== undefined &&
            createUserNotificationToken(props.userId, token);
        })
        .catch((err) => console.log(err.message));

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          updateBadgeCount(1);

          notification.request.content.title &&
            notification.request.content.body &&
            notification.request.content.data &&
            createUserNotification(props.userId, {
              title: notification.request.content.title,
              body: notification.request.content.body,
              timestamp: new Date(),
              payload: notification.request.content.data as NotificationPayload
            })
              .then(
                () =>
                  !countDisabled && setUnreadNotifCount((count) => count + 1)
              )
              .catch((err) => console.error(err.message));
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          updateBadgeCount(-1);

          const payload = response.notification.request.content
            .data as NotificationPayload;

          navigate("Notifications", { screen: "Home" });

          switch (payload.type) {
            case "EVENT":
              navigate("Notifications", {
                screen: "Event",
                params: { eventId: payload.eventId }
              });
              break;
            case "REPLY":
              navigate("Notifications", {
                screen: "Reply",
                params: {
                  eventId: payload.eventId,
                  topLevelCommentId: payload.topLevelCommentId,
                  replyId: payload.replyParentId
                }
              });
          }
        });

      return () => {
        notificationListener.current &&
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
        responseListener.current &&
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
      };
    } else if (props.loggedIn === false) {
      notifToken &&
        deleteUserNotificationToken(props.userId, notifToken).catch((err) =>
          console.error(err.message)
        );
      notificationListener.current?.remove();
      responseListener.current?.remove();
    }
  }, [props.loggedIn]);

  return (
    <NotificationContext.Provider
      value={{
        unreadNotifCount,
        setUnreadNotifCount,
        setCountDisabled
      }}>
      {props.children}
    </NotificationContext.Provider>
  );
}
