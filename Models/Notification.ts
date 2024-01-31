export interface Notification {
  id: string;
  data: NotificationData;
}

interface NotificationData {
  title: string;
  body: string;
  type: string;
  navParam: string;
}
