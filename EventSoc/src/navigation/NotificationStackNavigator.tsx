import {
  StackNavigationOptions,
  createStackNavigator
} from "@react-navigation/stack";
import { config } from "../../config/gluestack-ui.config";
import { ArrowLeftIcon, Icon } from "@gluestack-ui/themed";
import {
  NavigatorScreenParams,
  getFocusedRouteNameFromRoute
} from "@react-navigation/native";
import SocietiesStackNavigator, {
  SocietiesStackParamList
} from "./Societies/SocietiesStackNavigator";
import {
  EventStackParamList,
  EventStackScreens
} from "./CrossTabStackScreens/EventStackScreens";
import NotificationScreen from "../screens/NotificationScreen";
import { SocietyStackParamList } from "./CrossTabStackScreens/SocietyStackScreens";

export type NotificationStackParamList = {
  Home: undefined;
} & EventStackParamList &
  SocietyStackParamList;

export default function NotificationStackNavigator() {
  const Stack = createStackNavigator<NotificationStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: config.tokens.colors.navigationDarkPink
        }
      }}>
      <Stack.Screen
        name="Home"
        component={NotificationScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Society"
        component={SocietiesStackNavigator}
        options={({ route }) => {
          const currentScreen = getFocusedRouteNameFromRoute(route);
          return {
            headerShown: currentScreen === "Home"
          };
        }}
      />
      {EventStackScreens.map((screenInfo, index) => (
        <Stack.Screen
          key={index}
          {...screenInfo}
        />
      ))}
    </Stack.Navigator>
  );
}
