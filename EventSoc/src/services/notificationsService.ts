import { addDoc, getDocs } from "firebase/firestore";
import { Notification } from "../../../Models/Notification";
import { userNotificationsCol } from "../config/firebaseConfig";

export function storeNotification(userId: string, notification: Notification) {
  return addDoc(userNotificationsCol(userId), notification).catch((err) => {
    throw Error("Unable to store notification. Try again later.");
  });
}

export function retrieveNotifications(userId: string) {
  return getDocs(userNotificationsCol(userId))
    .then((notifsSnapshot) =>
      notifsSnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          timestamp: doc.data().timestamp
        } as Notification;
      })
    )
    .catch(() => {
      throw Error("Unable to retrieve notifications. Try again later.");
    });
}
