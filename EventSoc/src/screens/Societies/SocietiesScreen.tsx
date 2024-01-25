import {
  Button,
  ButtonText,
  ButtonIcon,
  AddIcon,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Heading,
  Icon,
  ArrowLeftIcon,
  EditIcon,
  Text,
  View,
  Divider,
  Alert,
  AlertText
} from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { SocietiesStackParamList } from "../../navigation/Societies/SocietiesStackNavigator";
import { useIsFocused } from "@react-navigation/native";
import { useAppContext } from "../../contexts/AppContext";
import { config } from "../../../config/gluestack-ui.config";
import SearchList from "../../components/SearchList";
import EventListButton from "../../components/EventListButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = StackScreenProps<SocietiesStackParamList, "Home">;

export default function SocietiesScreen(props: Props) {
  const { societies, updateSocietyData, events, updateEvents, userId } =
    useAppContext();

  const society = societies.find(
    (soc) => soc.id === props.route.params.societyId
  )?.data;

  const isExec = society?.execIds.includes(userId) ?? false;

  const socEvents = society
    ? events.filter((event) => society.eventIds.includes(event.id)).reverse()
    : [];

  const [retrieveSocEventsErrMsg, setRetrieveSocEventsErrMsg] =
    useState<string>("");

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && society) {
      updateSocietyData(props.route.params.societyId).catch();
      updateEvents()
        .then(() => setRetrieveSocEventsErrMsg(""))
        .catch(
          (err) => !socEvents.length && setRetrieveSocEventsErrMsg(err.message)
        );
    }
  }, [props.route.params.societyId, isFocused]);

  return (
    <ScreenView>
      {!society ? (
        <HStack
          gap={15}
          width="80%"
          marginTop={40}
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
          <View height="96%">
            <HStack
              backgroundColor={config.tokens.colors.coolGray200}
              gap={15}
              width="100%"
              height="15%"
              paddingHorizontal={15}
              alignItems="center">
              <Avatar size="lg">
                <AvatarFallbackText
                  color="white"
                  fontSize="$lg">
                  {society.name}
                </AvatarFallbackText>
                {society.pictureUrl && (
                  <AvatarImage
                    source={{ uri: society.pictureUrl }}
                    alt=""
                  />
                )}
              </Avatar>
              <Heading
                fontSize="$2xl"
                numberOfLines={1}>
                {society.name}
              </Heading>
              {isExec && (
                <Button
                  size="xl"
                  variant="link"
                  position="absolute"
                  right={15}
                  onPress={() =>
                    props.navigation.navigate("Edit Society", {
                      societyId: props.route.params.societyId
                    })
                  }>
                  <ButtonIcon
                    as={EditIcon}
                    size="xl"
                    color="black"
                  />
                </Button>
              )}
            </HStack>
            <Text
              fontSize="$sm"
              backgroundColor={config.tokens.colors.coolGray200}
              width="100%"
              height="20%"
              paddingHorizontal={10}
              numberOfLines={4}>
              {society.description}
            </Text>
            <Heading marginLeft={10}>Events:</Heading>
            {retrieveSocEventsErrMsg ? (
              <Alert
                action="error"
                variant="outline"
                width="80%"
                alignSelf="center">
                <MaterialIcons
                  name="error-outline"
                  size={40}
                  color={config.tokens.colors.error}
                  style={{ paddingRight: 10 }}
                />
                <AlertText>{retrieveSocEventsErrMsg}</AlertText>
              </Alert>
            ) : (
              <SearchList
                data={socEvents}
                renderItem={(event) => (
                  <EventListButton
                    event={event}
                    isExec={isExec}
                  />
                )}
                searchKeys={["data.name"]}
                itemSeperator={() => (
                  <Divider
                    h="$1"
                    bgColor="transparent"
                  />
                )}
                maxHeight={isExec ? "57%" : "73%"}
                clearSearch={[society, isFocused, socEvents]}
                listEmptyText="No events"
              />
            )}
          </View>
          {isExec && (
            <Button
              size={"xl"}
              borderRadius="$none"
              onPress={() =>
                props.navigation.navigate("Create Event", {
                  organiserId: props.route.params.societyId
                })
              }>
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
