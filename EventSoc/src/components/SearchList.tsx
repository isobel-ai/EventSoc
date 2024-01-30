import {
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  View,
  Text
} from "@gluestack-ui/themed";
import { ComponentType, ReactElement, useEffect, useState } from "react";
import { DimensionValue, Keyboard, FlatList } from "react-native";
import { searchFilter } from "../helpers/SearchHelper";

interface Props<I> {
  data: I[];
  renderItem: (item: I) => ReactElement;
  searchKeys: string[];
  clearSearch?: any[];
  curvedSearchBar?: boolean;
  itemSeperator?: ComponentType;
  maxHeight?: DimensionValue;
  listEmptyText?: string;
}

export default function SearchList<Item>(props: Props<Item>) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    Keyboard.dismiss(), setSearchTerm("");
  }, props.clearSearch ?? []);

  const filteredData = searchFilter(searchTerm, props.data, props.searchKeys);

  return (
    <View
      width="100%"
      maxHeight={props.maxHeight}
      gap={5}>
      <Input borderRadius={props.curvedSearchBar ? "$sm" : "$none"}>
        <InputField
          value={searchTerm}
          placeholder="Search"
          onChangeText={(t) => setSearchTerm(t)}
        />
        <InputSlot paddingRight={"$1.5"}>
          <InputIcon>
            <Icon as={SearchIcon} />
          </InputIcon>
        </InputSlot>
      </Input>
      <FlatList
        data={filteredData}
        extraData={props.data}
        renderItem={({ item }) => props.renderItem(item)}
        ItemSeparatorComponent={props.itemSeperator}
        keyboardShouldPersistTaps="always"
        ListEmptyComponent={
          <Text
            fontSize={"$lg"}
            alignSelf="center"
            paddingTop={10}>
            {props.listEmptyText || ""}
          </Text>
        }
      />
    </View>
  );
}
