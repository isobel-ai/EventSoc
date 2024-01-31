import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./src/hooks/useAuth";
import LoginStackNavigator from "./src/navigation/LoginStackNavigator";
import { User } from "../Models/User";
import { useEffect, useRef, useState } from "react";
import AppContext, { AppContent } from "./src/contexts/AppContext";
import { Society } from "../Models/Society";
import {
  retrieveEventData,
  retrieveEvents
} from "./src/services/eventsService";
import {
  retrieveSocieties,
  retrieveSocietyData
} from "./src/services/societiesService";
import {
  addNotificationToken,
  removeNotificationToken,
  retrieveUserData,
  retrieveUsers
} from "./src/services/usersService";
import { Event } from "../Models/Event";
import { LogBox } from "react-native";
import * as Notifications from "expo-notifications";
import { registerForPushNotifications } from "./src/services/expoNotificationsService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export default function App() {
  const { loggedIn, userId } = useAuth();

  const [societies, setSocieties] = useState<Society[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const updateSocieties = () => {
    return retrieveSocieties().then((newSocs) => {
      setSocieties(newSocs);
    });
  };

  const updateSocietyData = (socId: string) => {
    return retrieveSocietyData(socId).then((updatedData) =>
      setSocieties(
        societies.map((soc) =>
          soc.id === socId ? { id: soc.id, data: updatedData } : soc
        )
      )
    );
  };

  const updateEvents = () => {
    return retrieveEvents().then((newEvents) => {
      setEvents(newEvents);
    });
  };

  const updateEventData = (eventId: string) => {
    return retrieveEventData(eventId).then((updatedData) =>
      setEvents(
        events.map((event) =>
          event.id === eventId ? { id: event.id, data: updatedData } : event
        )
      )
    );
  };

  const updateUsers = () => {
    return retrieveUsers().then((newUsers) => {
      setUsers(newUsers);
    });
  };

  const updateUserData = (userId: string) => {
    return retrieveUserData(userId).then((updatedData) =>
      setUsers(
        users.map((user) =>
          user.id === userId ? { id: user.id, data: updatedData } : user
        )
      )
    );
  };

  const appContent: AppContent = {
    societies,
    events,
    users,
    userId,
    updateSocieties,
    updateEvents,
    updateUsers,
    updateSocietyData,
    updateEventData,
    updateUserData
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [notifToken, setNotifToken] = useState<string>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (loggedIn) {
      registerForPushNotifications()
        .then((token) => {
          setNotifToken(token);
          token !== undefined &&
            addNotificationToken(userId, token).catch((err) =>
              console.log(err.message)
            );
        })
        .then(() =>
          Promise.allSettled([updateSocieties(), updateEvents(), updateUsers()])
        )
        .then(() => setIsLoading(false));

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });

      return () => {
        notificationListener.current &&
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
        responseListener.current &&
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
      };
    } else if (loggedIn === false) {
      notifToken && removeNotificationToken(userId, notifToken);
      notificationListener.current?.remove();
      responseListener.current?.remove();
      setIsLoading(false);
    } else {
      // loggedIn === undefined
      setIsLoading(true);
    }
  }, [loggedIn]);

  useEffect(LogBox.ignoreAllLogs, []);

  return (
    <AppContext.Provider value={appContent}>
      <GluestackUIProvider config={config}>
        <SafeAreaProvider>
          {isLoading ? (
            <></>
          ) : (
            <NavigationContainer>
              {loggedIn ? <MainTabNavigator /> : <LoginStackNavigator />}
            </NavigationContainer>
          )}
        </SafeAreaProvider>
      </GluestackUIProvider>
    </AppContext.Provider>
  );
}
