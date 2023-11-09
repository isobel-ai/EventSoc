import { VStack } from "@gluestack-ui/themed";
import { RetrieveSocEvent } from "../models/SocEvent";
import EventListButton from "./EventListButton";

interface Props {
  eventList: RetrieveSocEvent[];
}

export default function EventList(props: Props) {
  return (
    <VStack space={"md"}>
      {props.eventList.map((event) => {
        return (
          <EventListButton
            key={event.id}
            retrieveSocEvent={event}
          />
        );
      })}
    </VStack>
  );
}
