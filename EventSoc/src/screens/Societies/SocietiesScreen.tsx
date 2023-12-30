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
import { useSocietiesContext } from "../../contexts/SocietiesContext";
import { retrieveUser } from "../../services/usersService";
import { isEqual } from "lodash";
import { RetrieveSociety } from "../../models/Society";
import { config } from "../../../config/gluestack-ui.config";
import { retrieveEvents } from "../../services/eventsService";
import SearchList from "../../components/SearchList";
import EventListButton from "../../components/EventListButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = StackScreenProps<SocietiesStackParamList, "Home">;

export default function SocietiesScreen(props: Props) {
  const { societies, societyEvents, setSocietyEvents } = useSocietiesContext();

  const [isExec, setIsExec] = useState<boolean>(false);

  const [errMsg, setErrMsg] = useState<string>("");

  const isFocused = useIsFocused();

  const [society, setSociety] = useState<RetrieveSociety>();

  const [eventDeleted, setEventDeleted] = useState<boolean>(false);

  useEffect(() => {
    const newSoc = societies.find(
      (soc) => soc.id === props.route.params.societyId
    );
    setSociety(newSoc);
    newSoc &&
      retrieveUser().then((user) => setIsExec(newSoc.exec.includes(user.name)));
  }, [props.route.params.societyId, isFocused]);

  useEffect(() => {
    society &&
      retrieveEvents(society.eventRefs).then((result) => {
        if (result instanceof Error) {
          setErrMsg(result.message);
        } else {
          setErrMsg("");
          setSocietyEvents(result);
        }
      }),
      setEventDeleted(false);
  }, [society, isFocused, eventDeleted]);

  return (
    <ScreenView extraStyle={{ height: "100%" }}>
      {!society ? (
        <HStack
          gap={15}
          flex={1}
          width="80%"
          marginTop={20}
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
          <View
            height="100%"
            top={-20}>
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
                      societyId: society.id
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
            {errMsg ? (
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
                <AlertText>{errMsg}</AlertText>
              </Alert>
            ) : (
              <SearchList
                data={societyEvents}
                renderItem={(event) => (
                  <EventListButton
                    retrieveEvent={event}
                    isExec={isExec}
                    setEventDeleted={setEventDeleted}
                  />
                )}
                searchKeys={["name"]}
                itemSeperator={() => <Divider h="$1" />}
                maxHeight={isExec ? "62%" : "69%"}
                clearSearch={[society, isFocused, societyEvents]}
              />
            )}
          </View>
          {isExec && (
            <Button
              size={"xl"}
              borderRadius="$none"
              onPress={() =>
                props.navigation.navigate("Create Event", {
                  organiserId: society.id
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
