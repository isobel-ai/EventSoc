import {
  FlatList,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  View,
  Text,
  Button,
  ButtonText
} from "@gluestack-ui/themed";
import {
  ComponentType,
  ReactElement,
  ReactNode,
  useEffect,
  useState
} from "react";
import { DimensionValue, Keyboard } from "react-native";
import { searchFilter } from "../helpers/SearchSortHelper";
import { MaterialIcons } from "@expo/vector-icons";
import SideMenu, {
  ReactNativeSideMenuProps
} from "react-native-side-menu-updated";
import { config } from "../../config/gluestack-ui.config";
import ScreenView from "./ScreenView";

interface Props<I> {
  data: I[];
  renderItem: (item: I) => ReactElement;
  searchKeys: string[];
  clearSearch?: any[];
  curvedSearchBar?: boolean;
  itemSeperator?: ComponentType;
  maxHeight?: DimensionValue;
  listEmptyText?: string;
  filterMenu: ReactNode;
  filterFunc: () => void;
  filterMenuSize?: number;
  refreshFilter?: () => void;
}

export default function SearchList<Item>(props: Props<Item>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Item[]>(props.data);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  if (props.clearSearch) {
    useEffect(() => {
      Keyboard.dismiss(), searchFunction("");
    }, props.clearSearch);
  }

  if (props.refreshFilter) {
    useEffect(props.refreshFilter, [isFilterMenuOpen]);
  }

  useEffect(() => {
    !isFilterMenuOpen && props.filterFunc();
  }, [isFilterMenuOpen]);

  useEffect(() => searchFunction(searchTerm), [props.data]); // Reload list

  const searchFunction = (text: string) => {
    setSearchTerm(text);
    setFilteredData(searchFilter(text, props.data, props.searchKeys));
  };

  const filterMenuProps: ReactNativeSideMenuProps = {
    menu: props.filterMenu,
    isOpen: isFilterMenuOpen,
    onChange: () => setIsFilterMenuOpen(!isFilterMenuOpen),
    bounceBackOnOverdraw: false,
    overlayColor: config.tokens.colors.tintBlack,
    openMenuOffset: props.filterMenuSize
  };

  return (
    <SideMenu {...filterMenuProps}>
      <ScreenView extraStyle={{ backgroundColor: "white", height: "100%" }}>
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
          <Button
            onPress={() => {
              Keyboard.dismiss(), setIsFilterMenuOpen(true);
            }}
            size="lg"
            variant="link"
            sx={{
              ":active": { _text: { textDecorationLine: "none" } }
            }}
            borderRadius="$none"
            borderTopWidth="$1"
            borderBottomWidth="$1"
            borderColor="black">
            <MaterialIcons
              name="filter-list"
              size={24}
              color="black"
              style={{ paddingRight: 10 }}
            />
            <ButtonText color="black">Filter</ButtonText>
          </Button>
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
      </ScreenView>
    </SideMenu>
  );
}
