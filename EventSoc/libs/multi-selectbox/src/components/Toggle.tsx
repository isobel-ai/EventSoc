import React, { memo, PropsWithoutRef } from "react";
import {
  TouchableOpacity,
  GestureResponderEvent,
  ColorValue
} from "react-native";
import Icon from "./Icon";
import { config } from "../../../../config/gluestack-ui.config";

export type ToggleProps = PropsWithoutRef<{
  onTouch?: (event: GestureResponderEvent) => void;
  checked?: boolean;
  iconColor?: ColorValue;
}>;

function Toggle({
  onTouch,
  checked,
  iconColor = config.tokens.colors.navigationDarkPink,
  ...props
}: ToggleProps) {
  return (
    <TouchableOpacity
      onPress={onTouch}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      {...props}>
      <Icon
        name={checked ? "deleteCircle" : "addCircle"}
        fill={iconColor}
      />
    </TouchableOpacity>
  );
}

export default memo(Toggle);
