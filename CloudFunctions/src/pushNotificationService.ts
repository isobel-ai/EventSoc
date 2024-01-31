import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { NotificationPayload } from "../../Models/Notification";

const expo = new Expo();

export function sendNotifications(
  recipientExpoTokens: string[],
  title: string,
  body: string,
  data: NotificationPayload
) {
  const messages: ExpoPushMessage[] = recipientExpoTokens
    .filter((token) => Expo.isExpoPushToken(token))
    .map((validToken) => {
      return {
        to: validToken,
        title: title,
        body: body,
        data: data,
        sound: "default",
        channelId: "default"
      };
    });

  // Batch notifications to compress them and reduce the number of requests
  const chunks = expo.chunkPushNotifications(messages);

  const sendNotificationAttempts = chunks.map((chunk) =>
    expo.sendPushNotificationsAsync(chunk)
  );

  return Promise.allSettled(sendNotificationAttempts);
}
