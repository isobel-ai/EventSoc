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
import {
  retrieveSocieties,
  retrieveSocietyData
} from "./src/services/societiesService";
import { retrieveUsers } from "./src/services/usersService";
import { Event } from "./src/models/Event";

export default function App() {
  // Auth
  const { loggedIn, userId } = useAuth();

  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(
    loggedIn === undefined
  );

  useEffect(() => setIsAuthLoading(loggedIn === undefined), [loggedIn]);

  // App Context
  const [societies, setSocieties] = useState<Society[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const updateSocieties = () => {
    return retrieveSocieties().then((result) => {
      if (result instanceof Error) {
        return result;
      }
      setSocieties(result);
    });
  };

  const updateEvents = () => {
    return retrieveEvents().then((result) => {
      if (result instanceof Error) {
        return result;
      }
      setEvents(result);
    });
  };

  const updateUsers = () => {
    return retrieveUsers().then((result) => {
      if (result instanceof Error) {
        return result;
      }
      setUsers(result);
    });
  };

  const updateSocietyInContext = (id: string) =>
    retrieveSocietyData(id).then((result) => {
      if (result instanceof Error) {
        return result;
      }
      setSocieties(
        societies.map((soc) => (soc.id === id ? { ...soc, data: result } : soc))
      );
    });

  const getUser = (): User | undefined => {
    return users.find((user) => user.id === userId);
  };

  const appContent: AppContent = {
    societies,
    events,
    users,
    updateSocieties,
    updateEvents,
    updateUsers,
    updateSocietyInContext,
    getUser
  };

  useEffect(() => {
    updateSocieties(), updateEvents(), updateUsers();
  }, []);

  return (
    <AppContext.Provider value={appContent}>
      <GluestackUIProvider config={config}>
        <SafeAreaProvider>
          {isAuthLoading ? (
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
