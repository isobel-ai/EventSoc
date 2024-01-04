import {
  StackNavigationOptions,
  createStackNavigator
} from "@react-navigation/stack";
import { config } from "../../config/gluestack-ui.config";
import { ArrowLeftIcon, Icon } from "@gluestack-ui/themed";
import EventsScreen from "../screens/Events/EventsScreen";
import EventScreen from "../screens/Events/EventScreen";
import { useState } from "react";
import { RetrieveSocEvent, defaultRetrieveSocEvent } from "../models/SocEvent";
import EventsContext from "../contexts/EventsContext";

export type EventsStackParamList = {
  Home: undefined;
  Event: undefined;
};

export default function EventsStackNavigator() {
  const [selectedSocEvent, setSelectedSocEvent] = useState<RetrieveSocEvent>(
    defaultRetrieveSocEvent
  );

  const Stack = createStackNavigator<EventsStackParamList>();

  const stackScreenOptions = (): StackNavigationOptions => ({
    headerTitle: "",
    headerStyle: {
      backgroundColor: config.tokens.colors.navigationDarkPink
    },
    headerBackTitle: "Back to event feed",
    headerBackTitleStyle: { color: "black", fontWeight: "bold" },
    headerBackImage: () => (
      <Icon
        as={ArrowLeftIcon}
        size="xl"
        style={{ paddingLeft: 40 }}
        color="black"
      />
    ),
    gestureEnabled: false
  });

  return (
    <EventsContext.Provider value={{ selectedSocEvent, setSelectedSocEvent }}>
      <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen
          name="Home"
          component={EventsScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Event"
          component={EventScreen}
        />
      </Stack.Navigator>
    </EventsContext.Provider>
  );
}
