import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  useTopPadding?: boolean;
  removeBottomPadding?: boolean;
  extraStyle?: StyleProp<ViewStyle>;
};

export default function ScreenView(props: Props) {
  const paddingTop = props.useTopPadding ? 20 : 0;
  const paddingBottom = props.removeBottomPadding ? 0 : 40;

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={[
        { paddingTop: paddingTop, paddingBottom: paddingBottom },
        props.extraStyle
      ]}>
      {props.children}
    </SafeAreaView>
  );
}
