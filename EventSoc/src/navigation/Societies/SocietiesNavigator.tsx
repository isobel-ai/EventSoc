import { useRef, useState } from "react";
import SocietiesStackNavigator from "./SocietiesStackNavigator";
import SocietiesContext from "../../contexts/SocietiesContext";
import { RetrieveEvent, defaultRetrieveEvent } from "../../models/Event";
import { RetrieveSociety, defaultRetrieveSociety } from "../../models/Society";
import SocietiesSideMenu from "./SocietiesSideMenu";

export default function SocietiesNavigator() {
  const [toEditEvent, setToEditEvent] =
    useState<RetrieveEvent>(defaultRetrieveEvent);

  const [eventDeleted, setEventDeleted] = useState<boolean>(false);

  const [selectedSoc, setSelectedSoc] = useState<RetrieveSociety>(
    defaultRetrieveSociety
  );
  const navigatorRef = useRef<any>({ current: null });

  return (
    <SocietiesContext.Provider
      value={{
        toEditEvent,
        setToEditEvent,
        eventDeleted,
        setEventDeleted,
        selectedSoc,
        setSelectedSoc,
        navigatorRef
      }}>
      <SocietiesSideMenu>
        <SocietiesStackNavigator />
      </SocietiesSideMenu>
    </SocietiesContext.Provider>
  );
}
