import {
  Button,
  ButtonText,
  ButtonIcon,
  AddIcon,
  ScrollView
} from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import ScreenView from "../../components/ScreenView";
import { RetrieveSocEvent } from "../../models/SocEvent";
import { retrieveManagedEvents } from "../../services/eventsService";
import EventList from "../../components/EventList";
import { StackScreenProps } from "@react-navigation/stack";
import { ManageEventsStackParamList } from "../../navigation/ManageEventsStackNavigator";
import { useIsFocused } from "@react-navigation/native";
import { useManageSocEventContext } from "../../contexts/ManageSocEventContext";

type Props = StackScreenProps<ManageEventsStackParamList, "Home">;

export default function ManageEventsScreen(props: Props) {
  const { eventDeleted, setEventDeleted } = useManageSocEventContext();

  const [managedEvents, setManagedEvents] = useState<RetrieveSocEvent[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    retrieveManagedEvents(setManagedEvents), setEventDeleted(false);
  }, [isFocused, eventDeleted]);

  return (
    <ScreenView>
      <Button
        size={"xl"}
        style={{ top: -20 }}
        onPress={() => props.navigation.navigate("Create Event")}>
        <ButtonIcon
          as={AddIcon}
          size="xl"
          style={{ position: "absolute", left: 10 }}
        />
        <ButtonText>Create Event</ButtonText>
      </Button>
      <ScrollView style={{ top: -15 }}>
        <EventList eventList={managedEvents} />
      </ScrollView>
    </ScreenView>
  );
}
