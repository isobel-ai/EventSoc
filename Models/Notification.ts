export interface Notification {
  id: string;
  data: NotificationData;
}

interface NotificationData {
  title: string;
  body: string;
  timestamp: Date;
  type: string;
  navParam: string;
}
