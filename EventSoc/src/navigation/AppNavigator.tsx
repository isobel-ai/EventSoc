import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./MainTabNavigator";
import LoginStackNavigator from "./LoginStackNavigator";
import UserContext from "../contexts/UserContext";

type Props = {
  loggedIn?: boolean;
  userId: string;
};

export default function AppNavigator(props: Props) {
  return (
    <>
      {props.loggedIn ? (
        <UserContext.Provider value={{ userId: props.userId }}>
          <MainTabNavigator />
        </UserContext.Provider>
      ) : (
        <LoginStackNavigator />
      )}
    </>
  );
}
