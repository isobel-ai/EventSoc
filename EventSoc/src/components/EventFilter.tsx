import {
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  View,
  Button,
  ButtonText
} from "@gluestack-ui/themed";
import { ReactNode, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { dateInRange, searchFilter } from "../helpers/SearchSortHelper";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenView from "./ScreenView";
import { RetrieveSocEvent } from "../models/SocEvent";
import EventFilterSideMenu from "./EventFilterSideMenu";
import { Item } from "../../libs/multi-selectbox";

interface Props {
  children: ReactNode;
  socEvents: RetrieveSocEvent[];
  setFullyFilteredSocEvents: React.Dispatch<
    React.SetStateAction<RetrieveSocEvent[]>
  >;
}

export default function EventFilter(props: Props) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  const [selectedSocItems, setSelectedSocItems] = useState<Item[]>([]);

  const [filterStartDate, setFilterStartDate] = useState<Date>();
  const [filterEndDate, setFilterEndDate] = useState<Date>();

  const [filteredSocEvents, setFilteredSocEvents] = useState<
    RetrieveSocEvent[]
  >(props.socEvents);

  const [searchTerm, setSearchTerm] = useState<string>("");

  // Reload feed
  useEffect(() => filterSocEvents(), [props.socEvents]);
  useEffect(() => searchFunction(searchTerm), [filteredSocEvents]);

  useEffect(() => {
    !isFilterMenuOpen && filterSocEvents();
  }, [isFilterMenuOpen]);

  const filterSocEvents = () => {
    const newFilteredSocEvents = props.socEvents.filter(
      (socEvent) =>
        dateInRange(socEvent.event.startDate, filterStartDate, filterEndDate) &&
        (selectedSocItems.length === 0 ||
          selectedSocItems.some(
            (socItem) => socItem.item === socEvent.society.name
          ))
    );
    setFilteredSocEvents(newFilteredSocEvents);
  };

  const searchFunction = (text: string) => {
    setSearchTerm(text);
    props.setFullyFilteredSocEvents(
      searchFilter(text, filteredSocEvents, ["event.name", "event.tags"])
    );
  };

  return (
    <EventFilterSideMenu
      {...{
        isFilterMenuOpen,
        setIsFilterMenuOpen,
        selectedSocItems,
        setSelectedSocItems,
        filterStartDate,
        setFilterStartDate,
        filterEndDate,
        setFilterEndDate
      }}>
      <ScreenView extraStyle={{ backgroundColor: "white", height: "100%" }}>
        <View
          width="100%"
          maxHeight="107%">
          <Input borderRadius="$none">
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
          {props.children}
        </View>
      </ScreenView>
    </EventFilterSideMenu>
  );
}
