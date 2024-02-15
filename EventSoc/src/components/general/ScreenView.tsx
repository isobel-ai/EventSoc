import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  useTopPadding?: boolean;
  extraStyle?: StyleProp<ViewStyle>;
};

export default function ScreenView(props: Props) {
  const paddingTop = props.useTopPadding ? 20 : 0;

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={[{ paddingTop: paddingTop, paddingBottom: 40 }, props.extraStyle]}>
      {props.children}
    </SafeAreaView>
  );
}
