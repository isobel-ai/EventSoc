import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./src/hooks/useAuth";
import { useEffect } from "react";
import { LogBox } from "react-native";
import NotificationProvider from "./src/providers/NotificationProvider";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const { loggedIn, userId } = useAuth();

  useEffect(LogBox.ignoreAllLogs, []);

  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <NotificationProvider {...{ userId, loggedIn }}>
          <SafeAreaProvider>
            <MenuProvider>
              <AppNavigator {...{ userId, loggedIn }} />
            </MenuProvider>
          </SafeAreaProvider>
        </NotificationProvider>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
