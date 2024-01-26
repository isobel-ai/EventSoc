export interface User {
  id: string;
  data: UserData;
}

export interface UserData {
  name: string;
  eventAttendingIds: string[];
  notificationToken: string;
}

export const defaultUserData: () => UserData = () => {
  return { name: "", eventAttendingIds: <string[]>[], notificationToken: "" };
};
