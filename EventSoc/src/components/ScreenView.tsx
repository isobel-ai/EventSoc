import { View } from "@gluestack-ui/themed";
import { ReactNode } from "react";

export default function ScreenView({ children }: { children: ReactNode }) {
  return <View style={{ paddingTop: 20 }}>{children}</View>;
}
