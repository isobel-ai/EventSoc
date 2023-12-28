import { createContext, useContext } from "react";
import { RetrieveEvent, defaultRetrieveEvent } from "../models/Event";
import { RetrieveSociety, defaultRetrieveSociety } from "../models/Society";

type SocietiesContent = {
  toEditEvent: RetrieveEvent;
  setToEditEvent: React.Dispatch<React.SetStateAction<RetrieveEvent>>;

  eventDeleted: boolean;
  setEventDeleted: React.Dispatch<React.SetStateAction<boolean>>;

  selectedSoc: RetrieveSociety;
  setSelectedSoc: React.Dispatch<React.SetStateAction<RetrieveSociety>>;

  updateSelectedSoc: () => Promise<void | Error>;

  navigatorRef: React.MutableRefObject<any>;
};

const SocietiesContext = createContext<SocietiesContent>({
  toEditEvent: defaultRetrieveEvent(),
  setToEditEvent: () => {},

  eventDeleted: false,
  setEventDeleted: () => {},

  selectedSoc: defaultRetrieveSociety(),
  setSelectedSoc: () => {},

  updateSelectedSoc: () => Promise.resolve(),

  navigatorRef: { current: null }
});
export default SocietiesContext;

export const useSocietiesContext = () => useContext(SocietiesContext);
