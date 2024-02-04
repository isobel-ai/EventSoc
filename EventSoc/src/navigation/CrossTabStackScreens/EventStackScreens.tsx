import EventScreen from "../../screens/EventStackScreens/EventScreen";
import EditEventScreen from "../../screens/EventStackScreens/EditEventScreen";
import ReplyScreen from "../../screens/EventStackScreens/ReplyScreen";
import { StackNavigationOptions } from "@react-navigation/stack";
import { Icon, ArrowLeftIcon, CloseIcon } from "@gluestack-ui/themed";

export type EventStackParamList = {
  Event: { eventId: string; showMenu?: boolean };
  "Edit Event": { eventId: string };
  Reply: { commentId: string; eventOrganiserId?: string };
};

interface EventStackScreenInfo {
  name: keyof EventStackParamList;
  component: (props: any) => React.JSX.Element;
  options?: StackNavigationOptions;
}

export const EventStackScreens: EventStackScreenInfo[] = [
  { name: "Event", component: EventScreen },
  {
    name: "Edit Event",
    component: EditEventScreen,
    options: {
      headerTitle: undefined, // Use default title
      headerBackImage: () => (
        <Icon
          as={CloseIcon}
          size="xl"
          style={{ paddingLeft: 40 }}
        />
      )
    }
  },
  { name: "Reply", component: ReplyScreen }
];

export const eventStackScreenOptions: StackNavigationOptions = {
  headerTitle: "Event",
  headerBackTitleVisible: false,
  headerBackImage: () => (
    <Icon
      as={ArrowLeftIcon}
      size="xl"
      style={{ paddingLeft: 40 }}
      color="black"
    />
  )
};
