import {
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon
} from "@gluestack-ui/themed";
import { ReactNode, useEffect, useState } from "react";
import { searchFilter } from "../../helpers/SearchHelper";
import { dateInRange } from "../../helpers/DateTimeHelper";
import ScreenView from "../general/ScreenView";
import { EventDoc, EventDocAndRecScore } from "../../../../Shared/models/Event";
import EventFilterSideMenu from "./EventFilterSideMenu";
import { Item } from "../../../libs/multi-selectbox";
import { config } from "../../../config/gluestack-ui.config";
import EventSortAndFilterButton from "./EventSortAndFilterButton";

type Props = {
  children: ReactNode;

  events: EventDocAndRecScore[];
  setEventFeed: (events: EventDoc[]) => void;
};

export default function EventSortAndFilter(props: Props) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  const [selectedSocItems, setSelectedSocItems] = useState<Item[]>([]);

  const [filterStartDate, setFilterStartDate] = useState<Date>();
  const [filterEndDate, setFilterEndDate] = useState<Date>();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [sortMethod, setSortMethod] = useState<"REC" | "DATE">("DATE");

  useEffect(() => {
    if (!isFilterMenuOpen) {
      const filteredEvents = props.events.filter(
        (event) =>
          dateInRange(event.data.startDate, filterStartDate, filterEndDate) &&
          (selectedSocItems.length === 0 ||
            selectedSocItems.some(
              (socItem) => socItem.id === event.data.organiser.id
            ))
      );

      const searchedEvents = searchFilter(searchTerm, filteredEvents, [
        "data.name",
        "data.tags"
      ]);

      switch (sortMethod) {
        case "REC":
          props.setEventFeed(searchedEvents.sort((a, b) => b.score - a.score));
          break;
        case "DATE":
          props.setEventFeed(
            searchedEvents.sort(
              (a, b) => a.data.startDate.getTime() - b.data.startDate.getTime()
            )
          );
      }
    }
  }, [sortMethod, searchTerm, props.events, isFilterMenuOpen]);

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
            onChangeText={setSearchTerm}
          />
          <InputSlot paddingRight={"$1.5"}>
            <InputIcon>
              <Icon as={SearchIcon} />
            </InputIcon>
          </InputSlot>
        </Input>
        <EventSortAndFilterButton
          setIsFilterMenuOpen={setIsFilterMenuOpen}
          sortMethod={sortMethod}
          setSortMethod={setSortMethod}
        />
        {props.children}
      </ScreenView>
    </EventFilterSideMenu>
  );
}
