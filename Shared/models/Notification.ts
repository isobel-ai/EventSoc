export type NotificationData = {
  title: string;
  body: string;
  timestamp: Date;
  payload: NotificationPayload;
};

export type NotificationPayload =
  | EventNotificationPayload
  | DeleteEventNotificationPayload
  | ReplyNotificationPayload;

type EventNotificationPayload = {
  type: "EVENT";
  eventId: string;
};

type DeleteEventNotificationPayload = {
  type: "DELETE EVENT";
};

type ReplyNotificationPayload = {
  type: "REPLY";
  topLevelCommentId?: string;
  replyParentId: string;
  eventId: string;
};
