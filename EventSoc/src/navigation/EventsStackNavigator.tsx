import {
  StackNavigationOptions,
  createStackNavigator
} from "@react-navigation/stack";
import { config } from "../../config/gluestack-ui.config";
import { ArrowLeftIcon, Icon } from "@gluestack-ui/themed";
import EventsScreen from "../screens/EventsScreen";
import {
  NavigatorScreenParams,
  getFocusedRouteNameFromRoute
} from "@react-navigation/native";
import SocietiesStackNavigator, {
  SocietiesStackParamList
} from "./Societies/SocietiesStackNavigator";
import {
  EventStackParamList,
  EventStackScreens,
  eventStackScreenOptions
} from "./CrossTabStackScreens/EventStackScreens";
import {
  SocietyStackParamList,
  SocietyStackScreens,
  societyStackScreenOptions
} from "./CrossTabStackScreens/SocietyStackScreens";

export type EventsStackParamList = {
  Home: undefined;
} & EventStackParamList &
  SocietyStackParamList;

export default function EventsStackNavigator() {
  const Stack = createStackNavigator<EventsStackParamList>();

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
        component={EventsScreen}
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <Stack.Group screenOptions={eventStackScreenOptions}>
        {EventStackScreens.map((screenInfo, index) => (
          <Stack.Screen
            key={index}
            {...screenInfo}
          />
        ))}
      </Stack.Group>
      <Stack.Group screenOptions={societyStackScreenOptions}>
        {SocietyStackScreens.map((screenInfo, index) => (
          <Stack.Screen
            key={index}
            {...screenInfo}
          />
        ))}
      </Stack.Group>
    </Stack.Navigator>
  );
}
