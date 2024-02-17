import { Divider } from "@gluestack-ui/themed";
import { EventDoc } from "../../../../Shared/models/Event";
import { config } from "../../../config/gluestack-ui.config";
import EventPost from "./EventPost";
import EventSignUp from "./EventSignUp";

type Props = {
  event: EventDoc;
  updateEvent: () => Promise<void>;
  isEventPostExtended?: boolean;
  onEventPostPress?: () => void;
};

export default function EventPostAndSignUp(props: Props) {
  return (
    <>
      <EventPost
        event={props.event}
        isExtended={props.isEventPostExtended}
        onPress={props.onEventPostPress}
      />
      <EventSignUp
        event={props.event}
        updateEvent={props.updateEvent}
      />
    </>
  );
}
