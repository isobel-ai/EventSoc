import React, { useState, memo, useMemo, PropsWithoutRef } from "react";
import { isEmpty, find } from "lodash";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  TextStyle,
  ViewStyle,
  TextInputProps,
  FlatListProps,
  GestureResponderEvent,
  DimensionValue,
  ColorValue,
  ScrollView
} from "react-native";
import Icon from "./src/components/Icon";
import Toggle from "./src/components/Toggle";
import { config } from "../../src/config/gluestack-ui.config";

const hitSlop = { top: 14, bottom: 14, left: 14, right: 14 };

const kOptionListViewStyle = {
  width: "100%",
  alignItems: "center",
  paddingVertical: 4
} as ViewStyle;

const renderItemStyle = { flexShrink: 1 };

export type SelectBoxProps = {
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputFilterContainerStyle?: ViewStyle;
  inputFilterStyle?: TextStyle;
  optionsLabelStyle?: TextStyle;
  optionContainerStyle?: ViewStyle;
  multiOptionContainerStyle?: ViewStyle;
  multiOptionsLabelStyle?: TextStyle;
  multiListEmptyLabelStyle?: TextStyle;
  listEmptyLabelStyle?: TextStyle;
  selectedItemStyle?: TextStyle;
  listEmptyText?: string;
  selectIcon?: React.ReactNode | React.ReactNode[];
  inputPlaceholder?: string;
  hideInputFilter?: boolean;
  width?: number | string;
  isMulti?: boolean;
  options?: Item[];
  value?: Item;
  selectedValues?: Item[];
  searchIconColor?: ColorValue;
  toggleIconColor?: ColorValue;
  searchInputProps?: TextInputProps;
  multiSelectInputFieldProps?: Partial<FlatListProps<Item>>;
  onChange?: (item: Item) => void;
  onMultiSelect?: (item: Item) => void;
  onTapClose?: (item: Item) => void;
  listOptionProps?: Partial<FlatListProps<Item>>;
  showAllOptions?: boolean;
  maxHeight?: DimensionValue;
};

export type Item = {
  id: string | number;
  name: string;
};

function SelectBox({
  labelStyle,
  containerStyle,
  inputFilterContainerStyle,
  inputFilterStyle,
  optionsLabelStyle,
  optionContainerStyle,
  multiOptionContainerStyle,
  multiOptionsLabelStyle,
  multiListEmptyLabelStyle,
  listEmptyLabelStyle,
  selectedItemStyle,
  listEmptyText = "No results found",
  listOptionProps,
  showAllOptions = true,
  ...props
}: SelectBoxProps) {
  const [inputValue, setInputValue] = useState("");

  function renderLabel(item: string) {
    const kOptionsLabelStyle = {
      fontSize: config.tokens.fontSizes.sm,
      color: config.tokens.colors.black,
      paddingLeft: 5,
      ...optionsLabelStyle
    };
    return <Text style={kOptionsLabelStyle}>{item}</Text>;
  }

  function renderItem({ item }: PropsWithoutRef<{ item: Item }>) {
    const { isMulti, onChange, onMultiSelect, selectedValues } = props;
    const kOptionContainerStyle = {
      borderColor: "#dadada",
      borderBottomWidth: 1,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      paddingVertical: 12,
      paddingRight: 10,
      justifyContent: "space-between",
      ...optionContainerStyle
    } as ViewStyle;
    return (
      <View style={kOptionContainerStyle}>
        {isMulti ? (
          <>
            <TouchableOpacity
              hitSlop={hitSlop}
              style={renderItemStyle}
              onPress={onPressMultiItem()}>
              {renderLabel(item.name)}
            </TouchableOpacity>
            <Toggle
              iconColor={toggleIconColor}
              checked={selectedValues && selectedValues.indexOf(item) > -1}
              onTouch={onPressMultiItem()}
            />
          </>
        ) : (
          <>
            <TouchableOpacity
              hitSlop={hitSlop}
              style={renderItemStyle}
              onPress={onPressItem()}>
              {renderLabel(item.name)}
              <View />
            </TouchableOpacity>
          </>
        )}
      </View>
    );

    function onPressMultiItem() {
      return (_e: GestureResponderEvent) =>
        onMultiSelect ? onMultiSelect(item) : null;
    }

    function onPressItem() {
      return (_e: GestureResponderEvent) => {
        return onChange ? onChange(item) : null;
      };
    }
  }

  function renderGroupItem({ item }: { item: Item }) {
    const { onTapClose, options } = props;
    const label = find(options, (o) => o.id === item.id);
    const kMultiOptionContainerStyle = {
      flexDirection: "row",
      borderRadius: 20,
      paddingVertical: 5,
      paddingRight: 5,
      paddingLeft: 10,
      marginRight: 4,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: config.tokens.colors.navigationDarkPink,
      flexGrow: 1,
      ...multiOptionContainerStyle
    } as ViewStyle;
    const kMultiOptionsLabelStyle = {
      color: "#fff",
      fontSize: config.tokens.fontSizes.sm,
      ...multiOptionsLabelStyle
    };
    return (
      <View style={kMultiOptionContainerStyle}>
        <Text style={kMultiOptionsLabelStyle}>{label?.name}</Text>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ marginLeft: 15 }}
          hitSlop={hitSlop}
          onPress={onPressItem()}>
          <Icon
            name="closeCircle"
            fill="#fff"
            width={21}
            height={21}
          />
        </TouchableOpacity>
      </View>
    );

    function onPressItem() {
      return (_e: any) => (onTapClose ? onTapClose(item) : null);
    }
  }
  const {
    inputPlaceholder = "Select",
    hideInputFilter,
    width = "100%",
    isMulti,
    options,
    value,
    selectedValues,
    searchIconColor = "black" as ColorValue,
    toggleIconColor = config.tokens.colors.navigationDarkPink as ColorValue,
    searchInputProps,
    multiSelectInputFieldProps
  } = props;
  const filteredSuggestions = useMemo(
    () =>
      options?.filter(
        (suggestion) =>
          suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      ),
    [inputValue, options]
  );

  function multiListEmptyComponent() {
    const kMultiListEmptyLabelStyle = {
      fontSize: 17,
      color: config.tokens.colors.placeholderGray,
      ...multiListEmptyLabelStyle
    };
    return (
      <View
        //@ts-ignore
        width="100%"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flexGrow: 1, width: "100%" }}
        hitSlop={hitSlop}>
        <Text style={kMultiListEmptyLabelStyle}>{inputPlaceholder}</Text>
      </View>
    );
  }

  function optionListEmpty() {
    const kListEmptyLabelStyle = {
      fontSize: 17,
      color: "rgba(60, 60, 67, 0.6)",
      ...listEmptyLabelStyle
    };
    return (
      <View style={kOptionListViewStyle}>
        <Text style={kListEmptyLabelStyle}>
          {filteredSuggestions?.length === 0 && listEmptyText}
        </Text>
      </View>
    );
  }
  const kLabelStyle = {
    fontSize: 12,
    color: "rgba(60, 60, 67, 0.6)",
    paddingBottom: 4,
    ...labelStyle
  };

  const kContainerStyle = {
    flexDirection: "row",
    width: "100%",
    borderColor: "#ddd",
    borderBottomWidth: 1,
    paddingTop: 6,
    paddingRight: 20,
    paddingBottom: 8,
    ...containerStyle
  } as ViewStyle;

  const selectBoxMaxHeight = props.maxHeight ? props.maxHeight : "100%";

  return (
    <View
      style={{ width: width as DimensionValue, maxHeight: selectBoxMaxHeight }}>
      <View style={kContainerStyle}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flexGrow: 1 }}>
          {isMulti ? (
            <FlatList
              data={selectedValues}
              extraData={{ inputValue, options }}
              keyExtractor={keyExtractor()}
              renderItem={renderGroupItem}
              horizontal={true}
              ListEmptyComponent={multiListEmptyComponent}
              {...multiSelectInputFieldProps}
            />
          ) : (
            <TouchableOpacity hitSlop={hitSlop}>
              <Text style={kSelectedItemStyle()}>
                {value?.name || inputPlaceholder}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Options wrapper */}
      <FlatList
        data={
          showAllOptions
            ? filteredSuggestions || options
            : inputValue
            ? filteredSuggestions
            : []
        }
        extraData={options}
        keyExtractor={keyExtractor()}
        renderItem={renderItem}
        numColumns={1}
        horizontal={false}
        initialNumToRender={5}
        maxToRenderPerBatch={20}
        windowSize={10}
        ListEmptyComponent={optionListEmpty}
        style={listOptionProps?.style}
        ListHeaderComponent={HeaderComponent()}
        stickyHeaderIndices={[0]}
        {...listOptionProps}
      />
    </View>
  );

  function keyExtractor() {
    return (o: Item) => `${o.id}-${Math.random()}`;
  }

  function kSelectedItemStyle() {
    return {
      fontSize: 17,
      color: isEmpty(value?.name) ? "rgba(60, 60, 67, 0.3)" : "#000",
      ...selectedItemStyle
    };
  }

  function HeaderComponent() {
    const kInputFilterContainerStyle = {
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 18,
      justifyContent: "space-between",
      backgroundColor: config.tokens.colors.defaultBackgroundLight,
      ...inputFilterContainerStyle
    } as ViewStyle;
    const kInputFilterStyle = {
      paddingVertical: 14,
      paddingRight: 8,
      color: "#000",
      flexGrow: 1,
      fontSize: config.tokens.fontSizes.sm,
      ...inputFilterStyle
    };
    return (
      <>
        {!hideInputFilter && (
          <View style={kInputFilterContainerStyle}>
            <TextInput
              value={inputValue}
              onChangeText={onChangeText()}
              style={kInputFilterStyle}
              placeholder="Search"
              placeholderTextColor={config.tokens.colors.placeholderGray}
              {...searchInputProps}
            />
            <Icon
              name="searchBoxIcon"
              fill={searchIconColor}
            />
          </View>
        )}
        <ScrollView keyboardShouldPersistTaps="handled" />
      </>
    );

    function onChangeText() {
      return (val: string) => setInputValue(val);
    }
  }
}

export default memo(SelectBox);
