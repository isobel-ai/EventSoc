import {
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  Text,
  ScrollView
} from "@gluestack-ui/themed";
import { ComponentType, ReactElement, useEffect, useState } from "react";
import { DimensionValue, Keyboard, FlatList } from "react-native";
import { searchFilter } from "../../helpers/SearchHelper";
import { isUndefined } from "lodash";
import ErrorAlert from "../error/ErrorAlert";
import { config } from "../../config/gluestack-ui.config";

type Props<I> = {
  ListHeaderComponent?: () => ReactElement;
  StickyListHeaderComponent?: () => ReactElement;
  data?: I[];
  renderItem: (item: I) => ReactElement;
  searchKeys: string[];
  clearSearchTriggers?: any[];
  curvedSearchBar?: boolean;
  itemSeperator?: ComponentType;
  maxHeight?: DimensionValue;
  listEmptyText?: string;
  listErrorMsg?: string;
};

export default function SearchList<Item>(props: Props<Item>) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    Keyboard.dismiss(), setSearchTerm("");
  }, props.clearSearchTriggers ?? []);

  const filteredData = !isUndefined(props.data)
    ? searchFilter(searchTerm, props.data, props.searchKeys)
    : [];

  const showList = !props.listErrorMsg && !isUndefined(props.data);

  const stickyHeaderIndices = showList
    ? isUndefined(props.ListHeaderComponent)
      ? [0]
      : [1]
    : undefined;

  return (
    <ScrollView
      width="100%"
      maxHeight={props.maxHeight}
      contentContainerStyle={{ gap: 5 }}
      stickyHeaderIndices={stickyHeaderIndices}>
      {!isUndefined(props.ListHeaderComponent) && props.ListHeaderComponent()}
      {props.listErrorMsg && (
        <ErrorAlert
          message={props.listErrorMsg}
          style={{ marginVertical: 10 }}
        />
      )}
      {showList && (
        <>
          {!isUndefined(props.StickyListHeaderComponent) &&
            props.StickyListHeaderComponent()}
          <Input
            borderRadius={props.curvedSearchBar ? "$sm" : "$none"}
            bgColor={config.tokens.colors.defaultBackgroundLight}>
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
        </>
      )}
      {showList && (
        <FlatList
          scrollEnabled={false}
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
      )}
    </ScrollView>
  );
}
