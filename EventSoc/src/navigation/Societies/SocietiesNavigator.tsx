import { useRef, useState } from "react";
import SocietiesStackNavigator from "./SocietiesStackNavigator";
import SocietiesContext from "../../contexts/SocietiesContext";
import {
  RetrieveSocEvent,
  defaultRetrieveSocEvent
} from "../../models/SocEvent";
import { RetrieveSociety, defaultRetrieveSociety } from "../../models/Society";
import SocietiesSideMenu from "./SocietiesSideMenu";

export default function SocietiesNavigator() {
  const [toEditEvent, setToEditEvent] = useState<RetrieveSocEvent>(
    defaultRetrieveSocEvent
  );
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
