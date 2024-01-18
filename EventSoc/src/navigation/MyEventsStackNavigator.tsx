import {
  StackNavigationOptions,
  createStackNavigator
} from "@react-navigation/stack";
import { config } from "../../config/gluestack-ui.config";
import { ArrowLeftIcon, Icon } from "@gluestack-ui/themed";
import EventScreen from "../screens/Events/EventScreen";
import {
  NavigatorScreenParams,
  getFocusedRouteNameFromRoute
} from "@react-navigation/native";
import SocietiesStackNavigator, {
  SocietiesStackParamList
} from "./Societies/SocietiesStackNavigator";
import EditEventScreen from "../screens/Societies/EditEventScreen";
import MyEventsScreen from "../screens/MyEventsScreen";

export type MyEventsStackParamList = {
  Home: undefined;
  Event: { eventId: string };
  "Edit Event": { eventId: string };
  Society: NavigatorScreenParams<SocietiesStackParamList>;
};

export default function MyEventsStackNavigator() {
  const Stack = createStackNavigator<MyEventsStackParamList>();

  const stackScreenOptions = (): StackNavigationOptions => ({
    headerTitle: "",
    headerStyle: {
      backgroundColor: config.tokens.colors.navigationDarkPink
    },
    headerBackTitleStyle: { color: "black", fontWeight: "bold", fontSize: 25 },
    headerBackImage: () => (
      <Icon
        as={ArrowLeftIcon}
        size="xl"
        style={{ paddingLeft: 40 }}
        color="black"
      />
    )
  });

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="Home"
        component={MyEventsScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Event"
        component={EventScreen}
      />
      <Stack.Screen
        name="Edit Event"
        component={EditEventScreen}
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
    </Stack.Navigator>
  );
}
