import { useState } from "react";
import { ScrollView } from "react-native";

export function useScrollOnResize(scrollViewRef: React.RefObject<ScrollView>) {
  const [isFirstScrollSizeChange, setIsFirstScrollSizeChange] =
    useState<boolean>(true);

  const handleResize = () => {
    if (isFirstScrollSizeChange) {
      setIsFirstScrollSizeChange(false);
    } else {
      scrollViewRef.current?.scrollToEnd();
    }
  };

  return handleResize;
}
