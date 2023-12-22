import {
  FlatList,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  View
} from "@gluestack-ui/themed";
import { ComponentType, ReactElement, useEffect, useState } from "react";
import { DimensionValue } from "react-native";
import { searchFilter } from "../helpers/SearchHelper";

interface Props<I> {
  data: I[];
  renderItem: (item: I) => ReactElement;
  clearSearch: boolean;
  curvedSearchBar?: boolean;
  itemSeperator?: ComponentType;
  maxHeight?: DimensionValue;
}

export default function SearchableList<Item extends { name: string }>(
  props: Props<Item>
) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Item[]>(props.data);

  useEffect(() => {
    setSearchTerm(""), setFilteredData(props.data);
  }, [props.clearSearch]);

  const searchFunction = (text: string) => {
    setSearchTerm(text);
    setFilteredData(searchFilter(text, props.data, "name"));
  };

  return (
    <View
      width="100%"
      maxHeight={props.maxHeight}>
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
      />
    </View>
  );
}
