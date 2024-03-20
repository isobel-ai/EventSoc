import MainTabNavigator from "./MainTabNavigator";
import LoginStackNavigator from "./LoginStackNavigator";

type Props = {
  loggedIn?: boolean;
};

export default function AppNavigator(props: Props) {
  return <>{props.loggedIn ? <MainTabNavigator /> : <LoginStackNavigator />}</>;
}
