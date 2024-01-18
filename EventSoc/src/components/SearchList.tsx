import {
  FlatList,
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
import { DimensionValue, Keyboard } from "react-native";
import { searchFilter } from "../helpers/SearchSortHelper";

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
  const [filteredData, setFilteredData] = useState<Item[]>(props.data);

  useEffect(() => {
    Keyboard.dismiss(), searchFunction("");
  }, props.clearSearch ?? []);

  useEffect(() => searchFunction(searchTerm), [props.data]); // Re-filter on list reload

  const searchFunction = (text: string) => {
    setSearchTerm(text);
    setFilteredData(searchFilter(text, props.data, props.searchKeys));
  };

  return (
    <View
      width="100%"
      maxHeight={props.maxHeight}
      gap={5}>
      <Input borderRadius={props.curvedSearchBar ? "$sm" : "$none"}>
        <InputField
          value={searchTerm}
          placeholder="Search"
          onChangeText={(t) => searchFunction(t)}
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
        renderItem={({ item }) => props.renderItem(item as Item)}
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
