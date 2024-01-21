import EventScreen from "../../screens/Event/EventScreen";
import EditEventScreen from "../../screens/Event/EditEventScreen";
import ReplyScreen from "../../screens/Event/ReplyScreen";

export type EventStackParamList = {
  Event: { eventId: string };
  "Edit Event": { eventId: string };
  Reply: { commentId: string; eventOrganiserId?: string };
};

interface ScreenInfo {
  name: keyof EventStackParamList;
  component: (props: any) => React.JSX.Element;
}

export const EventStackScreens: ScreenInfo[] = [
  { name: "Event", component: EventScreen },
  { name: "Edit Event", component: EditEventScreen },
  { name: "Reply", component: ReplyScreen }
];
