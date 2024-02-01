import { useState, useRef, useEffect } from "react";
import { NotificationPayload } from "../../../Models/Notification";
import {
  registerForPushNotifications,
  updateBadgeCount
} from "../services/expoNotificationsService";
import { storeNotification } from "../services/notificationsService";
import {
  addNotificationToken,
  removeNotificationToken
} from "../services/usersService";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { MainTabParamList } from "../navigation/MainTabNavigator";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useAppContext } from "../contexts/AppContext";
import { Event } from "../../../Models/Event";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: Platform.OS === "android"
  })
});

interface Props {
  loggedIn?: boolean;
  userId: string;
}

export default function NotificationProvider(props: Props) {
  const { navigate } =
    useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const { events } = useAppContext();

  const [notifToken, setNotifToken] = useState<string>();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (props.loggedIn) {
      registerForPushNotifications()
        .then((token) => {
          setNotifToken(token);
          token !== undefined && addNotificationToken(props.userId, token);
        })
        .catch((err) => console.log(err.message));

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          updateBadgeCount(1);

          notification.request.content.title &&
            notification.request.content.body &&
            notification.request.content.data &&
            storeNotification(props.userId, {
              title: notification.request.content.title,
              body: notification.request.content.body,
              timestamp: new Date(),
              payload: notification.request.content.data as NotificationPayload
            });
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          updateBadgeCount(-1);

          const payload = response.notification.request.content
            .data as NotificationPayload;

          let event: Event | undefined;
          switch (payload.type) {
            case "EVENT":
            case "REPLY":
              const eventId = payload.eventId;
              event = events.find((event) => event.id === eventId);
          }

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
                  commentId: payload.commentId,
                  eventOrganiserId: event?.data.organiserId
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
      notifToken && removeNotificationToken(props.userId, notifToken);
      notificationListener.current?.remove();
      responseListener.current?.remove();
    }
  }, [props.loggedIn]);

  return <></>;
}
