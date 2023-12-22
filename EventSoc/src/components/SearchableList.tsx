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
    const formattedText = text.toUpperCase();
    const newFilteredData = props.data.filter((item) => {
      const formattedItem = item.name.toUpperCase();
      return formattedItem.includes(formattedText);
    });
    setFilteredData(newFilteredData);
  };

  return (
    <View
      width="100%"
      maxHeight={props.maxHeight}>
      <Input borderRadius={props.curvedSearchBar ? "$sm" : "$none"}>
        <InputField
          value={searchTerm}
          placeholder="Search"
          onChangeText={(t) => {
            setSearchTerm(t);
            searchFunction(t);
          }}
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
