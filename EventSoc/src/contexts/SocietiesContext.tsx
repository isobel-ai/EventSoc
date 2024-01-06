import { createContext, useContext } from "react";
import { RetrieveEvent } from "../models/Event";
import { RetrieveSociety } from "../models/Society";

type SocietiesContent = {
  societies: RetrieveSociety[];
  setSocieties: React.Dispatch<React.SetStateAction<RetrieveSociety[]>>;

  updateSocietyInContext: (id: string) => Promise<void | Error>;

  societyEvents: RetrieveEvent[];
  setSocietyEvents: React.Dispatch<React.SetStateAction<RetrieveEvent[]>>;

  navigatorRef: React.MutableRefObject<any>;
};

const SocietiesContext = createContext<SocietiesContent>({
  societies: [],
  setSocieties: () => {},

  updateSocietyInContext: () => Promise.resolve(),

  societyEvents: [],
  setSocietyEvents: () => {},

  navigatorRef: { current: null }
});
export default SocietiesContext;

export const useSocietiesContext = () => useContext(SocietiesContext);
