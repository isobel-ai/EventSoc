import {
  Button,
  ButtonText,
  ButtonIcon,
  AddIcon,
  ScrollView,
  VStack,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Heading,
  Icon,
  ArrowLeftIcon,
  EditIcon,
  Text
} from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import ScreenView from "../../components/ScreenView";
import { RetrieveSocEvent } from "../../models/SocEvent";
import EventList from "../../components/EventList";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { useIsFocused } from "@react-navigation/native";
import { useSocietiesContext } from "../../contexts/SocietiesContext";
import { retrieveUser } from "../../services/usersService";
import { isEqual } from "lodash";
import { defaultRetrieveSociety } from "../../models/Society";
import { config } from "../../../config/gluestack-ui.config";
import { retrieveEvents } from "../../services/eventsService";

type Props = StackScreenProps<SocietiesStackParamList, "Home">;

export default function SocietiesScreen(props: Props) {
  const { selectedSoc, eventDeleted, setEventDeleted } = useSocietiesContext();

  const [isExec, setIsExec] = useState<boolean>(false);

  const [events, setEvents] = useState<RetrieveSocEvent[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    !isEqual(selectedSoc, defaultRetrieveSociety()) &&
      retrieveUser().then((user) =>
        setIsExec(selectedSoc.exec.includes(user.name))
      );
  }, [selectedSoc]);

  useEffect(() => {
    !isEqual(selectedSoc, defaultRetrieveSociety()) &&
      retrieveEvents(selectedSoc.eventRefs, setEvents),
      setEventDeleted(false);
  }, [selectedSoc, isFocused, eventDeleted]);

  return (
    <ScreenView extraStyle={{ height: "107%" }}>
      {/*remove style above if manange to stick create to button - set flatlist size? */}
      {isEqual(selectedSoc, defaultRetrieveSociety()) ? (
        <HStack
          gap={15}
          flex={1}
          width="80%"
          alignSelf="center">
          <Icon
            as={ArrowLeftIcon}
            size="2xl"
            top={25}
          />
          <Heading numberOfLines={2}>
            Swipe right to view or create a society page.
          </Heading>
        </HStack>
      ) : (
        <>
          <ScrollView
            top={-20}
            contentContainerStyle={{ gap: 10 }}>
            <VStack
              backgroundColor={config.tokens.colors.coolGray200}
              gap={10}
              paddingBottom={10}>
              <HStack
                gap={10}
                width="90%"
                marginTop={10}
                flex={1}
                alignItems="center">
                <Avatar size="lg">
                  <AvatarFallbackText
                    color="white"
                    fontSize="$lg">
                    {selectedSoc.name}
                  </AvatarFallbackText>
                  {selectedSoc.pictureUrl && (
                    <AvatarImage
                      source={{ uri: selectedSoc.pictureUrl }}
                      alt=""
                    />
                  )}
                </Avatar>
                <Heading
                  fontSize="$2xl"
                  numberOfLines={1}>
                  {selectedSoc.name}
                </Heading>
                {isExec && (
                  <Button
                    size="xl"
                    variant="link"
                    position="absolute"
                    right={10}>
                    <ButtonIcon
                      as={EditIcon}
                      size="xl"
                      color="black"
                    />
                  </Button>
                )}
              </HStack>
              <Text width="90%">{selectedSoc.description}</Text>
            </VStack>
            <Heading marginLeft={10}>Events:</Heading>
            <EventList eventList={events} />
          </ScrollView>
          {isExec && (
            <Button
              size={"xl"}
              borderRadius="$none"
              bottom={0}
              onPress={() => props.navigation.navigate("Create Event")}>
              <ButtonIcon
                as={AddIcon}
                size="xl"
                style={{ marginRight: 5 }}
              />
              <ButtonText>Create Event</ButtonText>
            </Button>
          )}
        </>
      )}
    </ScreenView>
  );
}
