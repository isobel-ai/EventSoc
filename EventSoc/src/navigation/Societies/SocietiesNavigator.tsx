import { useRef, useState } from "react";
import SocietiesStackNavigator from "./SocietiesStackNavigator";
import SocietiesContext from "../../contexts/SocietiesContext";
import { RetrieveEvent } from "../../models/Event";
import { RetrieveSociety } from "../../models/Society";
import SocietiesSideMenu from "./SocietiesSideMenu";
import { retrieveSociety } from "../../services/societiesService";

export default function SocietiesNavigator() {
  const [societies, setSocieties] = useState<RetrieveSociety[]>([]);

  const updateSocietyInContext = (id: string) =>
    retrieveSociety(id).then((result) => {
      if (result instanceof Error) {
        return result;
      }
      return setSocieties(
        societies.map((soc) => (soc.id === id ? result : soc))
      );
    });

  const [societyEvents, setSocietyEvents] = useState<RetrieveEvent[]>([]);

  const navigatorRef = useRef<any>({ current: null });

  return (
    <SocietiesContext.Provider
      value={{
        societies,
        setSocieties,
        updateSocietyInContext,
        societyEvents,
        setSocietyEvents,
        navigatorRef
      }}>
      <SocietiesSideMenu>
        <SocietiesStackNavigator />
      </SocietiesSideMenu>
    </SocietiesContext.Provider>
  );
}
