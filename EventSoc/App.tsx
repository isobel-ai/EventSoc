import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./src/hooks/useAuth";
import LoginStackNavigator from "./src/navigation/LoginStackNavigator";
import { useEffect } from "react";
import UserContext from "./src/contexts/UserContext";
import { LogBox } from "react-native";
import NotificationProvider from "./src/providers/NotificationProvider";
import { MenuProvider } from "react-native-popup-menu";

export default function App() {
  const { loggedIn, userId } = useAuth();

  useEffect(LogBox.ignoreAllLogs, []);

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>
        <MenuProvider>
          <NavigationContainer>
            <NotificationProvider {...{ userId, loggedIn }}>
              {loggedIn ? (
                <UserContext.Provider value={{ userId }}>
                  <MainTabNavigator />
                </UserContext.Provider>
              ) : (
                <LoginStackNavigator />
              )}
            </NotificationProvider>
          </NavigationContainer>
        </MenuProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
