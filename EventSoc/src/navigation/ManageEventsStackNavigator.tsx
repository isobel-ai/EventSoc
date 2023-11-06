import {
  StackNavigationOptions,
  createStackNavigator
} from "@react-navigation/stack";
import ManageEventsScreen from "../screens/ManageEvents/ManageEventsScreen";
import { config } from "../../config/gluestack-ui.config";
import CreateEventScreen from "../screens/ManageEvents/CreateEventScreen";
import EditEventScreen from "../screens/ManageEvents/EditEventScreen";
import { CloseIcon, Icon } from "@gluestack-ui/themed";

export type ManageEventsStackParamList = {
  Home: undefined;
  "Create Event": undefined;
  "Edit Event": undefined;
};

export default function ManageEventsStackNavigator() {
  const Stack = createStackNavigator<ManageEventsStackParamList>();

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
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="Home"
        component={ManageEventsScreen}
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
