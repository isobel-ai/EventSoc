import { addDoc, getDocs, orderBy, query } from "firebase/firestore";
import { NotificationData } from "../../../../Shared/models/Notification";
import { userNotificationsCol } from "../../config/firebaseConfig";
import { docToNotificationData } from "../../mappers/docToNotification";

export async function createUserNotification(
  userId: string,
  notification: NotificationData
) {
  await addDoc(userNotificationsCol(userId), notification).catch(() => {
    throw Error("Unable to store notification. Try again later.");
  });
}

export function retrieveUserNotifications(userId: string) {
  return getDocs(
    query(userNotificationsCol(userId), orderBy("timestamp", "desc"))
  ).then((notifsSnapshot) => notifsSnapshot.docs.map(docToNotificationData));
}
