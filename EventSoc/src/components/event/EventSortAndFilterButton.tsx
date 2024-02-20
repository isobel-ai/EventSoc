import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { config } from "../../../config/gluestack-ui.config";
import {
  Button,
  ButtonText,
  CheckIcon,
  Divider,
  HStack,
  Icon,
  Text
} from "@gluestack-ui/themed";
import { Keyboard } from "react-native";
import { useState } from "react";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger
} from "react-native-popup-menu";

type Props = {
  setIsFilterMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  sortMethod: "REC" | "DATE";
  setSortMethod: React.Dispatch<React.SetStateAction<"REC" | "DATE">>;
};

export default function EventSortAndFilterButton(props: Props) {
  const buttonProps: any = {
    size: "lg",
    variant: "link",
    sx: {
      ":active": { _text: { textDecorationLine: "none" } }
    },
    borderRadius: "$none",
    borderTopWidth: "$1",
    borderBottomWidth: "$1",
    borderColor: config.tokens.colors.black,
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <HStack>
      <Button
        onPress={() => {
          Keyboard.dismiss();
          props.setIsFilterMenuOpen(true);
        }}
        width="50%"
        {...buttonProps}>
        <MaterialIcons
          name="filter-list"
          size={24}
          color={config.tokens.colors.black}
          style={{ paddingRight: 10 }}
        />
        <ButtonText color={config.tokens.colors.black}>Filter</ButtonText>
      </Button>
      <Divider
        orientation="vertical"
        bgColor={config.tokens.colors.black}
      />
      <Menu style={{ width: "50%" }}>
        <MenuTrigger style={{ width: "100%" }}>
          <HStack
            {...buttonProps}
            paddingVertical={6}>
            <FontAwesome
              name="unsorted"
              size={24}
              color={config.tokens.colors.black}
              style={{ paddingRight: 10 }}
            />
            <Text
              color={config.tokens.colors.black}
              fontWeight="$semibold"
              fontSize="$lg">
              Sort
            </Text>
          </HStack>
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              marginTop: 44,
              width: "70%",
              borderWidth: 1,
              borderRadius: 0,
              backgroundColor: config.tokens.colors.backgroundLight100
            }
          }}>
          <MenuOption onSelect={() => props.setSortMethod("REC")}>
            <HStack
              alignItems="center"
              gap={5}>
              {props.sortMethod === "REC" && (
                <Icon
                  as={CheckIcon}
                  size="xl"
                  color={config.tokens.colors.success200}
                />
              )}
              <Text bold={props.sortMethod === "REC"}>Recommended for you</Text>
            </HStack>
          </MenuOption>
          <Divider bgColor={config.tokens.colors.black} />
          <MenuOption onSelect={() => props.setSortMethod("DATE")}>
            <HStack
              alignItems="center"
              gap={5}>
              {props.sortMethod === "DATE" && (
                <Icon
                  as={CheckIcon}
                  size="xl"
                  color={config.tokens.colors.success200}
                />
              )}
              <Text bold={props.sortMethod === "DATE"}>Date</Text>
            </HStack>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </HStack>
  );
}
