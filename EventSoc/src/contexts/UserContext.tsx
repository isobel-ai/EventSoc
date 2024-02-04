import { createContext, useContext } from "react";

export type UserContent = {
  userId: string;
};

const UserContext = createContext<UserContent>({
  userId: ""
});
export default UserContext;

export const useUserContext = () => useContext(UserContext);
