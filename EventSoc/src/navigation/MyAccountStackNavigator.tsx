import { createStackNavigator } from "@react-navigation/stack";
import { config } from "../config/gluestack-ui.config";
import {
  EventStackParamList,
  EventStackScreens,
  eventStackScreenOptions
} from "./CrossTabStackScreens/EventStackScreens";
import MyAccountScreen from "../screens/MyAccountScreen";
import {
  SocietyStackParamList,
  SocietyStackScreens,
  societyStackScreenOptions
} from "./CrossTabStackScreens/SocietyStackScreens";

export type MyAccountStackParamList = {
  Home: undefined;
} & EventStackParamList &
  SocietyStackParamList;

export default function MyAccountStackNavigator() {
  const Stack = createStackNavigator<MyAccountStackParamList>();

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
        component={MyAccountScreen}
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
