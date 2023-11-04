import {
  Button,
  ButtonText,
  ButtonIcon,
  AddIcon,
  VStack
} from "@gluestack-ui/themed";
import React from "react";
import ScreenView from "../components/ScreenView";

export default function ManageEventsScreen() {
  return (
    <ScreenView>
      <VStack>
        <Button size={"lg"}>
          <ButtonIcon as={AddIcon}></ButtonIcon>
          <ButtonText>Create Event</ButtonText>
        </Button>
      </VStack>
    </ScreenView>
  );
}
