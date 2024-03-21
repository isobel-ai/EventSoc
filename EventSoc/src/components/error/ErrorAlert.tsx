import { Alert, AlertText } from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DimensionValue, StyleProp, ViewStyle } from "react-native";

type Props = {
  message: string;
  width?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  variant?: "solid" | "outline" | "accent";
};

export default function ErrorAlert(props: Props) {
  return (
    <Alert
      action="error"
      variant={props.variant || "outline"}
      width={props.width || "95%"}
      alignSelf="center"
      style={props.style}>
      <MaterialIcons
        name="error-outline"
        size={40}
        color={config.tokens.colors.error}
        style={{ paddingRight: 15 }}
      />
      <AlertText>{props.message}</AlertText>
    </Alert>
  );
}
