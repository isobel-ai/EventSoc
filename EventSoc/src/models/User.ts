export interface User {
  id: string;
  data: UserData;
}

export interface UserData {
  name: string;
  eventAttendingIds: string[];
}

export const defaultUserData: () => UserData = () => {
  return { name: "", eventAttendingIds: <string[]>[] };
};
