import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./src/hooks/useAuth";
import LoginStackNavigator from "./src/navigation/LoginStackNavigator";

export default function App() {
  const loggedIn = useAuth();

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>
        <NavigationContainer>
          {loggedIn ? <MainTabNavigator /> : <LoginStackNavigator />}
        </NavigationContainer>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
