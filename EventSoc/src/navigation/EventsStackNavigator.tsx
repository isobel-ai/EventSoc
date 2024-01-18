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
  EventStackScreens
} from "./CrossTabStackScreens/EventStackScreens";

export type EventsStackParamList = {
  Home: undefined;
  Society: NavigatorScreenParams<SocietiesStackParamList>;
} & EventStackParamList;

export default function EventsStackNavigator() {
  const Stack = createStackNavigator<EventsStackParamList>();

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
        component={EventsScreen}
        options={{
          headerShown: false,
          gestureEnabled: false
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
