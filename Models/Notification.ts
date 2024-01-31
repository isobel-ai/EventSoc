export interface Notification {
  id: string;
  data: NotificationData;
}

interface NotificationData {
  title: string;
  body: string;
  timestamp: Date;
  payload: NotificationPayload;
}

export type NotificationPayload =
  | EventNotificationPayload
  | ReplyNotificationPayload;

type EventNotificationPayload = {
  type: "EVENT";
  eventId: string;
};

type ReplyNotificationPayload = {
  type: "REPLY";
  replyId: string;
};
