import { createContext, useContext } from "react";

type NotificationContent = {
  unreadNotifCount: number;
  setUnreadNotifCount: React.Dispatch<React.SetStateAction<number>>;

  setCountDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotificationContext = createContext<NotificationContent>({
  unreadNotifCount: 0,
  setUnreadNotifCount: () => {},

  setCountDisabled: () => {}
});
export default NotificationContext;

export const useNotificationContext = () => useContext(NotificationContext);
