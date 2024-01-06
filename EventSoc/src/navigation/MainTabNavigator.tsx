import {
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";
import MyAccountScreen from "../screens/MyAccountScreen";
import MyEventsScreen from "../screens/MyEventsScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { config } from "../../config/gluestack-ui.config";
import SocietiesNavigator from "./Societies/SocietiesNavigator";
import EventsStackNavigator, {
  EventsStackParamList
} from "./EventsStackNavigator";
import { NavigatorScreenParams } from "@react-navigation/native";
import { SocietiesStackParamList } from "./Societies/SocietiesStackNavigator";
import { useRef, useState } from "react";
import EventsContext from "../contexts/EventsContext";
import { RetrieveSocEvent } from "../models/SocEvent";
import SocietiesContext from "../contexts/SocietiesContext";
import { RetrieveEvent } from "../models/Event";
import { RetrieveSociety } from "../models/Society";
import { retrieveSociety } from "../services/societiesService";

export type MainTabParamList = {
  Events: NavigatorScreenParams<EventsStackParamList>;
  "My Events": undefined;
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

  const [socEvents, setSocEvents] = useState<RetrieveSocEvent[]>([]);

  const [societies, setSocieties] = useState<RetrieveSociety[]>([]);

  const updateSocietyInContext = (id: string) =>
    retrieveSociety(id).then((result) => {
      if (result instanceof Error) {
        return result;
      }
      return setSocieties(
        societies.map((soc) => (soc.id === id ? result : soc))
      );
    });

  const [societyEvents, setSocietyEvents] = useState<RetrieveEvent[]>([]);

  const navigatorRef = useRef<any>({ current: null });

  return (
    <EventsContext.Provider value={{ socEvents, setSocEvents }}>
      <SocietiesContext.Provider
        value={{
          societies,
          setSocieties,
          updateSocietyInContext,
          societyEvents,
          setSocietyEvents,
          navigatorRef
        }}>
        <Tab.Navigator screenOptions={tabNavigatorScreenOptions}>
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
      </SocietiesContext.Provider>
    </EventsContext.Provider>
  );
}
