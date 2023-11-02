import { GluestackUIProvider, Text, Box } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Box
          width="100%"
          justifyContent="center"
          alignItems="center">
          <Text>Open up App.js to start working on your app!</Text>
        </Box>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
