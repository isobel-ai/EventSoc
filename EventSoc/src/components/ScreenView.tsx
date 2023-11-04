import { View } from "@gluestack-ui/themed";

export default function ScreenView({
  children
}: {
  children: React.JSX.Element;
}) {
  return <View style={{ paddingTop: 20 }}>{children}</View>;
}
