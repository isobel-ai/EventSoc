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
import { searchFilter } from "../../helpers/SearchHelper";
import { dateInRange } from "../../helpers/DateTimeHelper";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenView from "../general/ScreenView";
import { EventDoc } from "../../../../Shared/models/Event";
import EventFilterSideMenu from "./EventFilterSideMenu";
import { Item } from "../../../libs/multi-selectbox";
import { config } from "../../../config/gluestack-ui.config";

type Props = {
  children: ReactNode;

  events: EventDoc[];
  setFullyFilteredEvents: (events: EventDoc[]) => void;
};

export default function EventFilter(props: Props) {
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
          (socItem) => socItem.id === event.data.organiser.id
        ))
  );

  useEffect(() => {
    !isFilterMenuOpen && handleSearch(searchTerm);
  }, [isFilterMenuOpen, props.events]);

  const handleSearch = (text: string) => {
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
      <ScreenView
        removeBottomPadding
        extraStyle={{
          backgroundColor: config.tokens.colors.white,
          height: "100%"
        }}>
        <Input borderRadius="$none">
          <InputField
            value={searchTerm}
            placeholder="Search"
            onChangeText={(t) => handleSearch(t)}
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
          borderColor={config.tokens.colors.black}>
          <MaterialIcons
            name="filter-list"
            size={24}
            color={config.tokens.colors.black}
            style={{ paddingRight: 10 }}
          />
          <ButtonText color={config.tokens.colors.black}>Filter</ButtonText>
        </Button>
        {props.children}
      </ScreenView>
    </EventFilterSideMenu>
  );
}
