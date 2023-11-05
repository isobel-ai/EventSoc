import {
  Button,
  ButtonText,
  ButtonIcon,
  AddIcon,
  VStack,
  ScrollView
} from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import ScreenView from "../components/ScreenView";
import SocEvent from "../models/SocEvent";
import { getManagedEvents } from "../services/eventsService";
import EventList from "../components/EventList";

export default function ManageEventsScreen() {
  const [managedEvents, setManagedEvents] = useState<SocEvent[]>([]);

  useEffect(() => getManagedEvents(setManagedEvents), []);

  return (
    <ScreenView>
      <VStack space={"md"}>
        <Button
          size={"xl"}
          width={325}>
          <ButtonIcon
            as={AddIcon}
            size="xl"
            style={{ position: "absolute", left: 10 }}
          />
          <ButtonText>Create Event</ButtonText>
        </Button>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <EventList eventList={managedEvents} />
        </ScrollView>
      </VStack>
    </ScreenView>
  );
}
