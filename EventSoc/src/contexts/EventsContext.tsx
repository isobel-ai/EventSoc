import { createContext, useContext } from "react";
import { RetrieveSocEvent, defaultRetrieveSocEvent } from "../models/SocEvent";

type EventsContent = {
  socEvents: RetrieveSocEvent[];
  setSocEvents: React.Dispatch<React.SetStateAction<RetrieveSocEvent[]>>;
};

const EventsContext = createContext<EventsContent>({
  socEvents: [],
  setSocEvents: () => {}
});
export default EventsContext;

export const useEventsContext = () => useContext(EventsContext);
