import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  hasNavHeader?: boolean;
  extraStyle?: StyleProp<ViewStyle>;
}

export default function ScreenView(props: Props) {
  const paddingTop = props.hasNavHeader ? 20 : 0;

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={[{ paddingTop: paddingTop, paddingBottom: 10 }, props.extraStyle]}>
      {props.children}
    </SafeAreaView>
  );
}
