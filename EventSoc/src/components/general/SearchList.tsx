import {
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  Text,
  ScrollView,
  Spinner
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

  const filteredData = isUndefined(props.data)
    ? undefined
    : searchFilter(searchTerm, props.data, props.searchKeys);

  const stickyHeaderIndices = isUndefined(filteredData)
    ? undefined
    : isUndefined(props.ListHeaderComponent)
    ? [0]
    : [1];

  return (
    <ScrollView
      width="100%"
      maxHeight={props.maxHeight}
      contentContainerStyle={{ gap: 5 }}
      stickyHeaderIndices={stickyHeaderIndices}>
      {!isUndefined(props.ListHeaderComponent) && props.ListHeaderComponent()}
      {props.listErrorMsg ? (
        <ErrorAlert
          message={props.listErrorMsg}
          style={{ marginVertical: 10 }}
        />
      ) : (
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
      <FlatList
        scrollEnabled={false}
        data={filteredData}
        extraData={props.data}
        renderItem={({ item }) => props.renderItem(item)}
        ItemSeparatorComponent={props.itemSeperator}
        keyboardShouldPersistTaps="always"
        ListEmptyComponent={
          isUndefined(filteredData) ? (
            <Spinner
              size="large"
              marginVertical={15}
            />
          ) : (
            <Text
              fontSize={"$lg"}
              alignSelf="center"
              paddingTop={10}>
              {props.listEmptyText || ""}
            </Text>
          )
        }
      />
    </ScrollView>
  );
}
