import { useState, useRef, useEffect } from "react";
import { NotificationPayload } from "../../../Models/Notification";
import { registerForPushNotifications } from "../services/expoNotificationsService";
import { storeNotification } from "../services/notificationsService";
import {
  addNotificationToken,
  removeNotificationToken
} from "../services/usersService";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

interface Props {
  loggedIn?: boolean;
  userId: string;
}

export default function NotificationProvider(props: Props) {
  const [notifToken, setNotifToken] = useState<string>();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (props.loggedIn) {
      registerForPushNotifications().then((token) => {
        setNotifToken(token);
        token !== undefined &&
          addNotificationToken(props.userId, token).catch((err) =>
            console.log(err.message)
          );
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
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
          console.log(response);
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
