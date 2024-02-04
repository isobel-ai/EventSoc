import {
  StackNavigationOptions,
  createStackNavigator
} from "@react-navigation/stack";
import SocietiesScreen from "../../screens/SocietyStackScreens/SocietiesScreen";
import { config } from "../../../config/gluestack-ui.config";
import CreateEventScreen from "../../screens/SocietyStackScreens/CreateEventScreen";
import { CloseIcon, Icon } from "@gluestack-ui/themed";
import EditSocietyScreen from "../../screens/SocietyStackScreens/EditSocietyScreen";
import {
  EventStackParamList,
  EventStackScreens,
  eventStackScreenOptions
} from "../CrossTabStackScreens/EventStackScreens";
import {
  SocietyStackScreenInfo,
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
        {SocietyStackScreens.map((screenInfo, index) => {
          const specialisedScreenInfo: SocietyStackScreenInfo =
            screenInfo.name === "Society"
              ? {
                  ...screenInfo,
                  options: { headerShown: false }
                }
              : screenInfo;
          return (
            <Stack.Screen
              key={index}
              {...specialisedScreenInfo}
              initialParams={
                screenInfo.name === "Society" ? { societyId: "" } : undefined
              }
            />
          );
        })}
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
