import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
}

export default function ScreenView(props: Props) {
  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{ paddingTop: 20, paddingBottom: 10 }}>
      {props.children}
    </SafeAreaView>
  );
}
