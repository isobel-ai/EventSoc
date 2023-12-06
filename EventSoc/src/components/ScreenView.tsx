import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  extraStyle?: StyleProp<ViewStyle>;
}

export default function ScreenView(props: Props) {
  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={[{ paddingTop: 20, paddingBottom: 10 }, props.extraStyle]}>
      {props.children}
    </SafeAreaView>
  );
}
