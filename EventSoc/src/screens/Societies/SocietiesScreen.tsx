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
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { useIsFocused } from "@react-navigation/native";
import { useSocietiesContext } from "../../contexts/SocietiesContext";

type Props = StackScreenProps<SocietiesStackParamList, "Home">;

export default function SocietiesScreen(props: Props) {
  const { eventDeleted, setEventDeleted } = useSocietiesContext();

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
