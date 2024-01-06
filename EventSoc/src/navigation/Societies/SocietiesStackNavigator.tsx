import {
  StackNavigationOptions,
  createStackNavigator
} from "@react-navigation/stack";
import SocietiesScreen from "../../screens/Societies/SocietiesScreen";
import { config } from "../../../config/gluestack-ui.config";
import CreateEventScreen from "../../screens/Societies/CreateEventScreen";
import EditEventScreen from "../../screens/Societies/EditEventScreen";
import { CloseIcon, Icon } from "@gluestack-ui/themed";
import { useSocietiesContext } from "../../contexts/SocietiesContext";
import RegisterSocietyScreen from "../../screens/Societies/RegisterSocietyScreen";
import EditSocietyScreen from "../../screens/Societies/EditSocietyScreen";

export type SocietiesStackParamList = {
  Home: { societyId: string };
  "Register Society": undefined;
  "Edit Society": { societyId: string };
  "Create Event": { organiserId: string };
  "Edit Event": { eventId: string };
};

export default function SocietiesStackNavigator() {
  const { navigatorRef } = useSocietiesContext();

  const Stack = createStackNavigator<SocietiesStackParamList>();

  const stackScreenOptions = (): StackNavigationOptions => ({
    headerStyle: {
      backgroundColor: config.tokens.colors.navigationDarkPink
    },
    headerBackTitleVisible: false,
    headerBackImage: () => (
      <Icon
        as={CloseIcon}
        size="xl"
        style={{ paddingLeft: 40 }}
      />
    ),
    gestureEnabled: false
  });

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => {
        navigatorRef.current = navigation;
        return stackScreenOptions();
      }}>
      <Stack.Screen
        name="Home"
        component={SocietiesScreen}
        options={{
          headerShown: false
        }}
        initialParams={{ societyId: "" }}
      />
      <Stack.Screen
        name="Register Society"
        component={RegisterSocietyScreen}
        options={{ headerLeft: () => null }} // Don't show back button
      />
      <Stack.Screen
        name="Edit Society"
        component={EditSocietyScreen}
      />
      <Stack.Screen
        name="Create Event"
        component={CreateEventScreen}
      />
      <Stack.Screen
        name="Edit Event"
        component={EditEventScreen}
      />
    </Stack.Navigator>
  );
}
