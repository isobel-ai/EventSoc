import { RetrieveSocEvent } from "../../models/SocEvent";
import { useEffect, useState } from "react";
import { retrieveSocEvents } from "../../services/socEventsService";
import { useIsFocused } from "@react-navigation/native";
import { Alert, AlertText, VStack, View } from "@gluestack-ui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../../config/gluestack-ui.config";
import EventPost from "../../components/EventPost";
import ScreenView from "../../components/ScreenView";
import SearchFilterList from "../../components/SearchFilterList";
import CalendarPicker from "react-native-calendar-picker";
import { endOfUniYear, toDateRangeString } from "../../helpers/DateTimeHelper";
import { Dimensions } from "react-native";
import SideMenuHeading from "../../components/SideMenuHeading";
import Tag from "../../components/Tag";
import { retrieveSocieties } from "../../services/societiesService";
import SelectBox, { Item } from "../../../libs/multi-selectbox";
import { isEqual, xorBy } from "lodash";
import { dateInRange } from "../../helpers/SearchSortHelper";

export default function EventsScreen() {
  const [socEvents, setSocEvents] = useState<RetrieveSocEvent[]>([]);
  const [filteredSocEvents, setFilteredSocEvents] = useState<
    RetrieveSocEvent[]
  >([]);

  const [errMsg, setErrMsg] = useState<string>("");

  const isFocused = useIsFocused();

  const [filterStartDate, setFilterStartDate] = useState<Date>();
  const [filterEndDate, setFilterEndDate] = useState<Date>();

  const [socItems, setSocItems] = useState<Item[]>([]);
  const [selectedSocItems, setSelectedSocItems] = useState<Item[]>([]);

  const [socErrMsg, setSocErrMsg] = useState<string>("");

  const updateDateRange = (
    momentDate: moment.Moment,
    type: "START_DATE" | "END_DATE"
  ) => {
    if (type === "START_DATE") {
      setFilterStartDate(momentDate.toDate());
    } else {
      setFilterEndDate(momentDate?.toDate());
    }
  };

  const resetDateRange = () => {
    setFilterStartDate(undefined), setFilterEndDate(undefined);
  };

  useEffect(() => {
    retrieveSocEvents().then((result) => {
      if (result instanceof Error) {
        setErrMsg(result.message);
      } else {
        setSocEvents(result);
        setErrMsg("");
      }
    });
  }, [isFocused]);

  const filterMenuSize = (5 * Dimensions.get("window").width) / 6;

  const handleSelectedSocItemsChange = (item: Item) => {
    setSelectedSocItems(xorBy(selectedSocItems, [item], "id"));
  };

  const filterSocEvents = () => {
    const newFilteredSocEvents = socEvents.filter(
      (socEvent) =>
        dateInRange(socEvent.event.startDate, filterStartDate, filterEndDate) &&
        (selectedSocItems.length === 0 ||
          selectedSocItems.some(
            (socItem) => socItem.item === socEvent.society.name
          ))
    );
    setFilteredSocEvents(newFilteredSocEvents);
  };

  useEffect(filterSocEvents, [socEvents]);

  const filterMenu = (
    <VStack
      height="100%"
      gap={5}>
      <SideMenuHeading heading="Society" />
      {socErrMsg ? (
        <Alert
          action="error"
          variant="outline"
          width="90%"
          alignSelf="center"
          marginVertical={15}>
          <MaterialIcons
            name="error-outline"
            size={40}
            color={config.tokens.colors.error}
            style={{ paddingRight: 15 }}
          />
          <AlertText>{socErrMsg}</AlertText>
        </Alert>
      ) : (
        <View
          height="42%"
          marginBottom={-5}>
          <SelectBox
            isMulti
            options={socItems}
            selectedValues={selectedSocItems}
            onMultiSelect={handleSelectedSocItemsChange}
            onTapClose={handleSelectedSocItemsChange}
            inputPlaceholder="No societies chosen"
            listEmptyText="No societies found"
            width="98%"
          />
        </View>
      )}
      <SideMenuHeading heading="Date Range" />
      {filterStartDate && (
        <View height="6%">
          <Tag
            label={toDateRangeString(filterStartDate, filterEndDate)}
            onCancel={resetDateRange}
          />
        </View>
      )}
      <CalendarPicker
        minDate={new Date()}
        maxDate={endOfUniYear()}
        selectedStartDate={filterStartDate}
        selectedEndDate={filterEndDate}
        onDateChange={updateDateRange}
        startFromMonday
        allowRangeSelection
        allowBackwardRangeSelect
        selectedDayColor={config.tokens.colors.navigationDarkPink}
        selectedDayTextColor={config.tokens.colors.white}
        todayBackgroundColor="transparent"
        todayTextStyle={{ color: "black" }}
        width={filterMenuSize}
      />
    </VStack>
  );

  const refreshFilter = () => {
    retrieveSocieties().then((result) => {
      if (result instanceof Error) {
        setSocErrMsg(result.message);
      } else {
        const items = result.map((soc) => {
          return { id: soc.id, item: soc.name };
        });
        setSocItems(items);
        setSelectedSocItems(
          items.filter((item) =>
            selectedSocItems.some((selectedItem) => isEqual(item, selectedItem))
          )
        );
        setSocErrMsg("");
      }
    });
  };

  return (
    <>
      {errMsg ? (
        <ScreenView>
          <Alert
            action="error"
            variant="outline"
            width="80%"
            marginTop={20}
            alignSelf="center">
            <MaterialIcons
              name="error-outline"
              size={40}
              color={config.tokens.colors.error}
              style={{ paddingRight: 10 }}
            />
            <AlertText>{errMsg}</AlertText>
          </Alert>
        </ScreenView>
      ) : (
        <SearchFilterList
          data={filteredSocEvents}
          renderItem={(socEvent) => <EventPost socEvent={socEvent} />}
          searchKeys={["event.name", "event.tags"]}
          filterMenu={filterMenu}
          filterFunc={filterSocEvents}
          maxHeight="107%"
          listEmptyText="No events"
          filterMenuSize={filterMenuSize}
          refreshFilter={refreshFilter}
        />
      )}
    </>
  );
}
