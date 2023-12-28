import { useRef, useState } from "react";
import SocietiesStackNavigator from "./SocietiesStackNavigator";
import SocietiesContext from "../../contexts/SocietiesContext";
import { RetrieveEvent, defaultRetrieveEvent } from "../../models/Event";
import { RetrieveSociety, defaultRetrieveSociety } from "../../models/Society";
import SocietiesSideMenu from "./SocietiesSideMenu";
import { retrieveSociety } from "../../services/societiesService";

export default function SocietiesNavigator() {
  const [toEditEvent, setToEditEvent] =
    useState<RetrieveEvent>(defaultRetrieveEvent);

  const [eventDeleted, setEventDeleted] = useState<boolean>(false);

  const [selectedSoc, setSelectedSoc] = useState<RetrieveSociety>(
    defaultRetrieveSociety
  );

  const updateSelectedSoc = () =>
    retrieveSociety(selectedSoc.id).then((result) => {
      if (result instanceof Error) {
        return result;
      }
      return setSelectedSoc(result);
    });

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
        updateSelectedSoc,
        navigatorRef
      }}>
      <SocietiesSideMenu>
        <SocietiesStackNavigator />
      </SocietiesSideMenu>
    </SocietiesContext.Provider>
  );
}
