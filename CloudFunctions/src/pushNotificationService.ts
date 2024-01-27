import { Expo, ExpoPushMessage } from "expo-server-sdk";

const expo = new Expo();

export function sendNotifications(
  recipientExpoTokens: string[],
  title: string,
  message?: string
) {
  const messages: ExpoPushMessage[] = recipientExpoTokens
    .filter((token) => Expo.isExpoPushToken(token))
    .map((validToken) => {
      return {
        to: validToken,
        sound: "default",
        title: title,
        body: message,
        badge: 1,
        channelId: "default"
      };
    });

  // Batch notifications to compress them and reduce the number of requests
  const chunks = expo.chunkPushNotifications(messages);

  const sendNotificationAttempts = chunks.map((chunk) =>
    expo.sendPushNotificationsAsync(chunk).catch((err) => Error(err))
  );

  return Promise.all(sendNotificationAttempts);
}
