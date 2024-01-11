import { VStack, AlertText, Alert, View } from "@gluestack-ui/themed";
import React, { ReactNode, useEffect, useState } from "react";
import CalendarPicker from "react-native-calendar-picker";
import SideMenu, {
  ReactNativeSideMenuProps
} from "react-native-side-menu-updated";
import { toDateRangeString, endOfUniYear } from "../helpers/DateTimeHelper";
import SideMenuHeading from "./SideMenuHeading";
import Tag from "./Tag";
import { MaterialIcons } from "@expo/vector-icons";
import { config } from "../../config/gluestack-ui.config";
import SelectBox, { Item } from "../../libs/multi-selectbox";
import { isEqual, xorBy } from "lodash";
import { Dimensions } from "react-native";
import { useAppContext } from "../contexts/AppContext";

interface Props {
  children: ReactNode;

  isFilterMenuOpen: boolean;
  setIsFilterMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  selectedSocItems: Item[];
  setSelectedSocItems: React.Dispatch<React.SetStateAction<Item[]>>;

  filterStartDate?: Date;
  setFilterStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;

  filterEndDate?: Date;
  setFilterEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export default function EventFilterSideMenu(props: Props) {
  const { updateSocieties, societies } = useAppContext();

  const [socItems, setSocItems] = useState<Item[]>([]);

  const [retrieveSocsErrMsg, setRetrieveSocsErrMsg] = useState<string>("");

  useEffect(() => {
    props.isFilterMenuOpen &&
      updateSocieties()
        .then(() => {
          const items = societies.map((soc) => {
            return { id: soc.id, item: soc.data.name };
          });
          setSocItems(items);
          props.setSelectedSocItems(
            items.filter((item) =>
              props.selectedSocItems.some((selectedItem) =>
                isEqual(item, selectedItem)
              )
            )
          );
          setRetrieveSocsErrMsg("");
        })
        .catch((err) => setRetrieveSocsErrMsg(err.message));
  }, [props.isFilterMenuOpen]);

  const handleSelectedSocItemsChange = (item: Item) => {
    props.setSelectedSocItems(xorBy(props.selectedSocItems, [item], "id"));
  };

  const updateDateRange = (
    momentDate: moment.Moment,
    type: "START_DATE" | "END_DATE"
  ) => {
    if (type === "START_DATE") {
      props.setFilterStartDate(momentDate.toDate());
    } else {
      props.setFilterEndDate(momentDate?.toDate());
    }
  };

  const resetDateRange = () => {
    props.setFilterStartDate(undefined), props.setFilterEndDate(undefined);
  };

  const filterMenuSize = (5 * Dimensions.get("window").width) / 6;

  const filterMenuProps: ReactNativeSideMenuProps = {
    menu: (
      <VStack
        height="100%"
        gap={5}>
        <SideMenuHeading heading="Society" />
        {retrieveSocsErrMsg ? (
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
            <AlertText>{retrieveSocsErrMsg}</AlertText>
          </Alert>
        ) : (
          <View
            height="42%"
            marginBottom={-5}>
            <SelectBox
              isMulti
              options={socItems}
              selectedValues={props.selectedSocItems}
              onMultiSelect={handleSelectedSocItemsChange}
              onTapClose={handleSelectedSocItemsChange}
              inputPlaceholder="No societies chosen"
              listEmptyText="No societies found"
              width="98%"
            />
          </View>
        )}
        <SideMenuHeading heading="Date Range" />
        {props.filterStartDate && (
          <View height="6%">
            <Tag
              label={toDateRangeString(
                props.filterStartDate,
                props.filterEndDate
              )}
              onCancel={resetDateRange}
            />
          </View>
        )}
        <CalendarPicker
          minDate={new Date()}
          maxDate={endOfUniYear()}
          selectedStartDate={props.filterStartDate}
          selectedEndDate={props.filterEndDate}
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
    ),
    isOpen: props.isFilterMenuOpen,
    onChange: () => props.setIsFilterMenuOpen(!props.isFilterMenuOpen),
    bounceBackOnOverdraw: false,
    overlayColor: config.tokens.colors.tintBlack,
    openMenuOffset: filterMenuSize
  };

  return <SideMenu {...filterMenuProps}>{props.children}</SideMenu>;
}
