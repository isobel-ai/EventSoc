import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./src/config/gluestack-ui.config";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./src/hooks/useAuth";
import { useEffect } from "react";
import { LogBox } from "react-native";
import NotificationProvider from "./src/providers/NotificationProvider";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import UserContext from "./src/contexts/UserContext";

export default function App() {
  const { loggedIn, userId } = useAuth();

  useEffect(LogBox.ignoreAllLogs, []);

  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <NotificationProvider {...{ userId, loggedIn }}>
          <UserContext.Provider value={{ userId }}>
            <StripeProvider publishableKey="pk_test_51O1C0sE3ylGeoycXkm2dJKlmiKfd8VSzwkxYt5QQipsS2H3q1kJ2JcmMWVqkRq7aCsY5k5wYAGAGhVLRxomdRxX200w0OYxhCF">
              <SafeAreaProvider>
                <MenuProvider>
                  <AppNavigator {...{ userId, loggedIn }} />
                </MenuProvider>
              </SafeAreaProvider>
            </StripeProvider>
          </UserContext.Provider>
        </NotificationProvider>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
