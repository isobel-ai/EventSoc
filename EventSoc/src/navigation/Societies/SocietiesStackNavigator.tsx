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

export type SocietiesStackParamList = {
  Home: undefined;
  "Create Event": undefined;
  "Edit Event": undefined;
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
    )
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
