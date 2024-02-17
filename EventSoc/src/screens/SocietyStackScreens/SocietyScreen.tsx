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
import ScreenView from "../../components/general/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import { useIsFocused } from "@react-navigation/native";
import { useUserContext } from "../../contexts/UserContext";
import { config } from "../../../config/gluestack-ui.config";
import SearchList from "../../components/general/SearchList";
import EventListButton from "../../components/event/EventListButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SocietyStackParamList } from "../../navigation/CrossTabStackScreens/SocietyStackScreens";
import SocietyProfile from "../../components/society/SocietyProfile";
import { isUndefined } from "lodash";
import ErrorAlert from "../../components/error/ErrorAlert";
import { EventDoc, EventOverview } from "../../../../Shared/models/Event";
import { retrieveIsUserSocietyExecMember } from "../../services/society/societyExecService";
import { retrieveSocietyEvents } from "../../services/society/societyEventsService";

type Props = StackScreenProps<SocietyStackParamList, "Society">;

export default function SocietyScreen(props: Props) {
  const { userId } = useUserContext();

  const [isExec, setIsExec] = useState<boolean>(false);

  const [socEvents, setSocEvents] = useState<EventOverview[]>();
  const [showRetrieveEventsErr, setShowRetrieveEventsErr] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !isUndefined(props.route.params.societyId)) {
      retrieveIsUserSocietyExecMember(props.route.params.societyId, userId)
        .then(setIsExec)
        .catch((err) => console.error(err.message));

      retrieveSocietyEvents(props.route.params.societyId)
        .then((events) => {
          setSocEvents(events);
          setShowRetrieveEventsErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          isUndefined(socEvents) && setShowRetrieveEventsErr(true);
        });
    }
  }, [props.route.params.societyId, isFocused]);

  return (
    <ScreenView>
      {isUndefined(props.route.params.societyId) ? (
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
          <View
            height={isExec ? "100%" : "103.5%"}
            paddingBottom={10}>
            <SearchList
              ListHeaderComponent={() => (
                <SocietyProfile
                  societyId={props.route.params.societyId ?? ""}
                  isExec={isExec}
                />
              )}
              StickyListHeaderComponent={() => (
                <Heading
                  marginLeft={10}
                  bgColor={config.tokens.colors.defaultBackgroundLight}>
                  Events:
                </Heading>
              )}
              data={socEvents}
              renderItem={(event) => (
                <EventListButton
                  event={event}
                  isExec={isExec}
                />
              )}
              searchKeys={["name"]}
              itemSeperator={() => (
                <Divider
                  h="$1"
                  bgColor="transparent"
                />
              )}
              clearSearchTriggers={[props.route.params.societyId]}
              listEmptyText="No events"
              listErrorMsg={
                showRetrieveEventsErr
                  ? "Couldn't retrieve society events. Try again later."
                  : undefined
              }
            />
          </View>
          {isExec && (
            <Button
              size="xl"
              placement="absoluteBottom"
              onPress={() =>
                !isUndefined(props.route.params.societyId) &&
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
