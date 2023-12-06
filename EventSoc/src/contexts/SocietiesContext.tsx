import { createContext, useContext } from "react";
import { RetrieveSocEvent, defaultRetrieveSocEvent } from "../models/SocEvent";

type SocietiesContent = {
  toEditEvent: RetrieveSocEvent;
  setToEditEvent: React.Dispatch<React.SetStateAction<RetrieveSocEvent>>;

  eventDeleted: boolean;
  setEventDeleted: React.Dispatch<React.SetStateAction<boolean>>;
};

const SocietiesContext = createContext<SocietiesContent>({
  toEditEvent: defaultRetrieveSocEvent,
  setToEditEvent: () => {},
  eventDeleted: false,
  setEventDeleted: () => {}
});
export default SocietiesContext;

export const useSocietiesContext = () => useContext(SocietiesContext);
