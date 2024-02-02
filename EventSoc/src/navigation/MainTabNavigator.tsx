import {
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";
import MyAccountScreen from "../screens/MyAccountScreen";
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
import NotificationStackNavigator, {
  NotificationStackParamList
} from "./NotificationStackNavigator";
import IconBadge from "react-native-icon-badge";
import { useNotificationContext } from "../contexts/NotificationContext";
import { Text } from "@gluestack-ui/themed";

export type MainTabParamList = {
  Events: NavigatorScreenParams<EventsStackParamList>;
  "My Events": NavigatorScreenParams<MyEventsStackParamList>;
  "My Account": undefined;
  Notifications: NavigatorScreenParams<NotificationStackParamList>;
  Societies: NavigatorScreenParams<SocietiesStackParamList>;
};

export default function MainTabNavigator() {
  const { unreadNotifCount } = useNotificationContext();

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
        component={NotificationStackNavigator}
        options={{
          tabBarIcon: ({ size }) => (
            <IconBadge
              MainElement={
                <MaterialCommunityIcons
                  name="bell-ring"
                  size={size}
                />
              }
              BadgeElement={
                <Text
                  top={-4}
                  color="white"
                  fontSize="$xs">
                  {unreadNotifCount}
                </Text>
              }
              IconBadgeStyle={{ width: 20, height: 20, right: -7, top: -5 }}
              Hidden={unreadNotifCount === 0}
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
