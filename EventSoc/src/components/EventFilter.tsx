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
import { searchFilter } from "../helpers/SearchHelper";
import { dateInRange } from "../helpers/DateTimeHelper";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenView from "./ScreenView";
import { Event } from "../models/Event";
import EventFilterSideMenu from "./EventFilterSideMenu";
import { Item } from "../../libs/multi-selectbox";
import { useAppContext } from "../contexts/AppContext";

interface Props {
  children: ReactNode;

  events: Event[];
  setFullyFilteredEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

export default function EventFilter(props: Props) {
  const { events } = useAppContext();

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  const [selectedSocItems, setSelectedSocItems] = useState<Item[]>([]);

  const [filterStartDate, setFilterStartDate] = useState<Date>();
  const [filterEndDate, setFilterEndDate] = useState<Date>();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredEvents = props.events.filter(
    (event) =>
      dateInRange(event.data.startDate, filterStartDate, filterEndDate) &&
      (selectedSocItems.length === 0 ||
        selectedSocItems.some(
          (socItem) => socItem.id === event.data.organiserId
        ))
  );

  useEffect(() => {
    !isFilterMenuOpen && searchFunction(searchTerm);
  }, [isFilterMenuOpen, events]);

  const searchFunction = (text: string) => {
    setSearchTerm(text);
    props.setFullyFilteredEvents(
      searchFilter(text, filteredEvents, ["data.name", "data.tags"])
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
