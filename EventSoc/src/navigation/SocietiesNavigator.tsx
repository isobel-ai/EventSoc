import { useState } from "react";
import SlideOverModal from "../components/SlideOverModal";
import GestureRecognizer from "react-native-swipe-gestures";
import SocietiesStackNavigator from "./SocietiesStackNavigator";
import { Heading } from "@gluestack-ui/themed";

export default function SocietiesNavigator() {
  const [isSlideOverVisible, setIsSlideOverVisible] = useState<boolean>(false);

  return (
    <GestureRecognizer
      onSwipeRight={() => setIsSlideOverVisible(true)}
      onSwipeLeft={() => setIsSlideOverVisible(false)}
      style={{ flex: 1 }}>
      <SocietiesStackNavigator />
      <SlideOverModal
        isVisible={isSlideOverVisible}
        setIsVisible={setIsSlideOverVisible}>
        <Heading>heading</Heading>
      </SlideOverModal>
    </GestureRecognizer>
  );
}
