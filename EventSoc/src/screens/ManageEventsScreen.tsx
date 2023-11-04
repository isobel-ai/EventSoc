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

export default function ManageEventsScreen() {
  const [managedEvents, setManagedEvents] = useState<SocEvent[]>([]);

  useEffect(() => getManagedEvents(setManagedEvents), []);

  console.log(managedEvents);

  return (
    <ScreenView>
      <VStack>
        <Button size={"lg"}>
          <ButtonIcon as={AddIcon}></ButtonIcon>
          <ButtonText>Create Event</ButtonText>
        </Button>
      </VStack>
      <ScrollView></ScrollView>
    </ScreenView>
  );
}
