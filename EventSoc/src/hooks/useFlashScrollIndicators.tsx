import { useEffect } from "react";
import { ScrollView } from "react-native";

export function useFlashScrollIndicators(
  scrollViewRef: React.RefObject<ScrollView>
) {
  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.flashScrollIndicators(), 500);
  }, []);
}
