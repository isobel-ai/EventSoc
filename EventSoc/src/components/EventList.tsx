import { VStack } from "@gluestack-ui/themed";
import SocEvent from "../models/SocEvent";
import EventListButton from "./EventListButton";

interface Props {
  eventList: SocEvent[];
}

export default function EventList(props: Props) {
  let eventKey = 0;

  return (
    <VStack space={"md"}>
      {props.eventList.map((event) => {
        return (
          <EventListButton
            key={eventKey++}
            event={event}
          />
        );
      })}
    </VStack>
  );
}
