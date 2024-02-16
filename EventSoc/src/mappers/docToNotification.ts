import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { isUndefined } from "lodash";
import { NotificationData } from "../../../Shared/models/Notification";

export function docToNotificationData(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Document ${doc.ref.path} does not exist`);
  }

  const notificationData = {
    ...data,
    timestamp: data.timestamp.toDate()
  } as NotificationData;
  return notificationData;
}
