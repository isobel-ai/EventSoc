import { useState } from "react";
import SocietiesSlideOverModal from "../components/SocietiesSlideOverModal";
import GestureRecognizer from "react-native-swipe-gestures";
import SocietiesStackNavigator from "./SocietiesStackNavigator";
import SocietiesContext from "../contexts/SocietiesContext";
import { RetrieveSocEvent, defaultRetrieveSocEvent } from "../models/SocEvent";

export default function SocietiesNavigator() {
  const [toEditEvent, setToEditEvent] = useState<RetrieveSocEvent>(
    defaultRetrieveSocEvent
  );
  const [eventDeleted, setEventDeleted] = useState<boolean>(false);
  const [isSlideOverVisible, setIsSlideOverVisible] = useState<boolean>(false);

  return (
    <SocietiesContext.Provider
      value={{ toEditEvent, setToEditEvent, eventDeleted, setEventDeleted }}>
      <GestureRecognizer
        onSwipeRight={() => setIsSlideOverVisible(true)}
        onSwipeLeft={() => setIsSlideOverVisible(false)}
        style={{ flex: 1 }}>
        <SocietiesStackNavigator />
        <SocietiesSlideOverModal
          isVisible={isSlideOverVisible}
          setIsVisible={setIsSlideOverVisible}
        />
      </GestureRecognizer>
    </SocietiesContext.Provider>
  );
}
