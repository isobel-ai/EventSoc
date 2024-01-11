export interface User {
  id: string;
  data: UserData;
}

export interface UserData {
  name: string;
}

export const defaultUserData: () => UserData = () => {
  return { name: "" };
};
