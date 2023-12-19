import { createContext, useContext } from "react";
import { RetrieveSocEvent, defaultRetrieveSocEvent } from "../models/SocEvent";
import { RetrieveSociety, defaultRetrieveSociety } from "../models/Society";

type SocietiesContent = {
  toEditEvent: RetrieveSocEvent;
  setToEditEvent: React.Dispatch<React.SetStateAction<RetrieveSocEvent>>;

  eventDeleted: boolean;
  setEventDeleted: React.Dispatch<React.SetStateAction<boolean>>;

  selectedSoc: RetrieveSociety;
  setSelectedSoc: React.Dispatch<React.SetStateAction<RetrieveSociety>>;

  navigatorRef: React.MutableRefObject<any>;
};

const SocietiesContext = createContext<SocietiesContent>({
  toEditEvent: defaultRetrieveSocEvent,
  setToEditEvent: () => {},

  eventDeleted: false,
  setEventDeleted: () => {},

  selectedSoc: defaultRetrieveSociety,
  setSelectedSoc: () => {},

  navigatorRef: { current: null }
});
export default SocietiesContext;

export const useSocietiesContext = () => useContext(SocietiesContext);
