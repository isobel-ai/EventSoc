import { View } from "@gluestack-ui/themed";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ScreenView(props: Props) {
  return <View style={{ paddingTop: 20 }}>{props.children}</View>;
}
