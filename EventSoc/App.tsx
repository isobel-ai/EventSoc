import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./src/hooks/useAuth";
import LoginStackNavigator from "./src/navigation/LoginStackNavigator";
import { User } from "./src/models/User";
import { useEffect, useState } from "react";
import AppContext, { AppContent } from "./src/contexts/AppContext";
import { Society } from "./src/models/Society";
import { retrieveEvents } from "./src/services/eventsService";
import { retrieveSocieties } from "./src/services/societiesService";
import { retrieveUsers } from "./src/services/usersService";
import { Event } from "./src/models/Event";
import { LogBox } from "react-native";

export default function App() {
  const { loggedIn, userId } = useAuth();

  // App Context
  const [societies, setSocieties] = useState<Society[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const updateSocieties = () => {
    return retrieveSocieties().then((newSocs) => {
      setSocieties(newSocs);
    });
  };

  const updateEvents = () => {
    return retrieveEvents().then((newEvents) => {
      setEvents(newEvents);
    });
  };

  const updateUsers = () => {
    return retrieveUsers().then((newUsers) => {
      setUsers(newUsers);
    });
  };

  const appContent: AppContent = {
    societies,
    events,
    users,
    userId,
    updateSocieties,
    updateEvents,
    updateUsers
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loggedIn) {
      updateSocieties()
        .then(updateEvents)
        .then(updateUsers)
        .then(() => setIsLoading(false));
    } else {
      setIsLoading(loggedIn === undefined);
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
