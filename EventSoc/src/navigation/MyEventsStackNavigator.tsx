import {
  createStackNavigator
} from "@react-navigation/stack";
import { config } from "../../config/gluestack-ui.config";


import {
  SocietiesStackParamList
} from "./SocietiesNavigator/SocietiesStackNavigator";
import MyEventsScreen from "../screens/MyEventsScreen";
import {
  EventStackParamList,
  EventStackScreens,
  eventStackScreenOptions
} from "./CrossTabStackScreens/EventStackScreens";
import {
  societyStackScreenOptions,
  SocietyStackScreens
} from "./CrossTabStackScreens/SocietyStackScreens";

export type MyEventsStackParamList = {
  Home: undefined;
} & EventStackParamList &
  SocietiesStackParamList;

export default function MyEventsStackNavigator() {
  const Stack = createStackNavigator<MyEventsStackParamList>();

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
        component={MyEventsScreen}
        options={{
          headerShown: false
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
