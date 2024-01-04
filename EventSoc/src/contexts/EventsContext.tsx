import { createContext, useContext } from "react";
import { RetrieveSocEvent, defaultRetrieveSocEvent } from "../models/SocEvent";

type EventsContent = {
  selectedSocEvent: RetrieveSocEvent;
  setSelectedSocEvent: React.Dispatch<React.SetStateAction<RetrieveSocEvent>>;
};

const EventsContext = createContext<EventsContent>({
  selectedSocEvent: defaultRetrieveSocEvent(),
  setSelectedSocEvent: () => {}
});
export default EventsContext;

export const useEventsContext = () => useContext(EventsContext);
