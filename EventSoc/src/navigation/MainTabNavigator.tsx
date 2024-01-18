import {
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";
import MyAccountScreen from "../screens/MyAccountScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { config } from "../../config/gluestack-ui.config";
import SocietiesNavigator from "./Societies/SocietiesNavigator";
import EventsStackNavigator, {
  EventsStackParamList
} from "./EventsStackNavigator";
import { NavigatorScreenParams } from "@react-navigation/native";
import { SocietiesStackParamList } from "./Societies/SocietiesStackNavigator";
import MyEventsStackNavigator, {
  MyEventsStackParamList
} from "./MyEventsStackNavigator";

export type MainTabParamList = {
  Events: NavigatorScreenParams<EventsStackParamList>;
  "My Events": NavigatorScreenParams<MyEventsStackParamList>;
  "My Account": undefined;
  Notifications: undefined;
  Societies: NavigatorScreenParams<SocietiesStackParamList>;
};

export default function MainTabNavigator() {
  const Tab = createBottomTabNavigator<MainTabParamList>();

  const tabNavigatorScreenOptions = (): BottomTabNavigationOptions => ({
    headerStyle: { backgroundColor: config.tokens.colors.navigationLightPink },
    tabBarStyle: { backgroundColor: config.tokens.colors.navigationLightPink },
    tabBarActiveBackgroundColor: config.tokens.colors.navigationDarkPink,
    tabBarShowLabel: false
  });

  return (
    <Tab.Navigator
      initialRouteName="Events"
      screenOptions={tabNavigatorScreenOptions}>
      <Tab.Screen
        name="Events"
        component={EventsStackNavigator}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="home"
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="My Events"
        component={MyEventsStackNavigator}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="calendar-heart"
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="My Account"
        component={MyAccountScreen}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="account"
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="bell-ring"
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="Societies"
        component={SocietiesNavigator}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={size}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}
