import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./src/navigation/MainTabNavigator";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
