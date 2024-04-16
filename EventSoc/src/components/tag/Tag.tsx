import { View, Text, Icon, CloseCircleIcon } from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  label: string;
  onCancel: () => void;
};

export default function Tag(props: Props) {
  const containerStyle: ViewStyle = {
    flexDirection: "row",
    borderRadius: 20,
    paddingVertical: 5,
    paddingRight: 5,
    paddingLeft: 10,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: config.tokens.colors.navigationDarkPink,
    flexGrow: 1
  };

  const labelStyle: TextStyle = {
    color: config.tokens.colors.white,
    fontSize: config.tokens.fontSizes.sm
  };

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{props.label}</Text>
      <TouchableOpacity
        style={{ marginLeft: 15 }}
        hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        onPress={props.onCancel}>
        <Icon
          as={CloseCircleIcon}
          fill="$navigationDarkPink"
          color="$white"
          w={21}
          h={21}
        />
      </TouchableOpacity>
    </View>
  );
}
