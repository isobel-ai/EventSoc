import {
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";
import EventsScreen from "../screens/EventsScreen";
import MyAccountScreen from "../screens/MyAccountScreen";
import MyEventsScreen from "../screens/MyEventsScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { config } from "../../config/gluestack-ui.config";
import SocietiesNavigator from "./SocietiesNavigator";

export default function MainTabNavigator() {
  const Tab = createBottomTabNavigator();

  const tabNavigatorScreenOptions = (): BottomTabNavigationOptions => ({
    headerStyle: { backgroundColor: config.tokens.colors.navigationLightPink },
    tabBarStyle: { backgroundColor: config.tokens.colors.navigationLightPink },
    tabBarActiveBackgroundColor: config.tokens.colors.navigationDarkPink,
    tabBarShowLabel: false
  });

  return (
    <Tab.Navigator screenOptions={tabNavigatorScreenOptions}>
      <Tab.Screen
        name="Events"
        component={EventsScreen}
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
        component={MyEventsScreen}
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
