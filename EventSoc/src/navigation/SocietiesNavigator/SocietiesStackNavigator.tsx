import {
  StackNavigationOptions,
  createStackNavigator
} from "@react-navigation/stack";
import { config } from "../../../config/gluestack-ui.config";
import {
  EventStackParamList,
  EventStackScreens,
  eventStackScreenOptions
} from "../CrossTabStackScreens/EventStackScreens";
import {
  SocietyStackParamList,
  SocietyStackScreens,
  societyStackScreenOptions
} from "../CrossTabStackScreens/SocietyStackScreens";
import RegisterSocietyScreen from "../../screens/RegisterSocietyScreen";

export type SocietiesStackParamList = {
  "Register Society": undefined;
} & SocietyStackParamList &
  EventStackParamList;

export default function SocietiesStackNavigator() {
  const Stack = createStackNavigator<SocietiesStackParamList>();

  const stackScreenOptions: StackNavigationOptions = {
    headerStyle: {
      backgroundColor: config.tokens.colors.navigationDarkPink
    },
    gestureEnabled: false
  };

  return (
    <Stack.Navigator
      initialRouteName="Society"
      screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="Register Society"
        component={RegisterSocietyScreen}
        options={{ animationEnabled: false, headerLeft: () => null }} // Don't show back button
      />
      <Stack.Group screenOptions={societyStackScreenOptions}>
        {SocietyStackScreens.map((screenInfo, index) => (
          <Stack.Screen
            key={index}
            {...{
              ...screenInfo,
              options: {
                ...screenInfo.options,
                headerShown: screenInfo.name !== "Society"
              },
              initialParams: {}
            }}
          />
        ))}
      </Stack.Group>
      <Stack.Group screenOptions={eventStackScreenOptions}>
        {EventStackScreens.map((screenInfo, index) => (
          <Stack.Screen
            key={index}
            {...screenInfo}
          />
        ))}
      </Stack.Group>
    </Stack.Navigator>
  );
}
