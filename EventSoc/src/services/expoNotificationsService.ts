import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function registerForPushNotifications() {
  // Only physical devices support push notifications
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return;
  }

  // On Android a channel must be specified
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C"
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      return "";
    }
  }

  const projectId: string = Constants.expoConfig?.extra?.eas.projectId;
  if (!projectId) {
    console.log("Failed to get projectId.");
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

export function updateBadgeCount(by: number) {
  Platform.OS === "ios" &&
    Notifications.getBadgeCountAsync()
      .then((count) =>
        Notifications.setBadgeCountAsync(Math.max(0, count + by))
      )
      .then((result) => !result && console.log("Failed to update badge"))
      .catch((err) => console.log(err));
}
