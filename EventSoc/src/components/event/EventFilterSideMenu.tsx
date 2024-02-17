import { VStack, View } from "@gluestack-ui/themed";
import React, { ReactNode, useEffect, useState } from "react";
import CalendarPicker from "react-native-calendar-picker";
import SideMenu, {
  ReactNativeSideMenuProps
} from "react-native-side-menu-updated";
import { toDateRangeString, endOfUniYear } from "../../helpers/DateTimeHelper";
import SideMenuHeading from "../general/SideMenuHeading";
import Tag from "../tag/Tag";
import { config } from "../../../config/gluestack-ui.config";
import SelectBox, { Item } from "../../../libs/multi-selectbox";
import { isEqual, isUndefined, xorBy } from "lodash";
import { Dimensions, Keyboard } from "react-native";
import { retrieveSocietyNames } from "../../services/namesService";
import ErrorAlert from "../error/ErrorAlert";

type Props = {
  children: ReactNode;

  isFilterMenuOpen: boolean;
  setIsFilterMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  selectedSocItems: Item[];
  setSelectedSocItems: React.Dispatch<React.SetStateAction<Item[]>>;

  filterStartDate?: Date;
  setFilterStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;

  filterEndDate?: Date;
  setFilterEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export default function EventFilterSideMenu(props: Props) {
  const [socItems, setSocItems] = useState<Item[]>();
  const [showRetrieveSocsErr, setShowRetrieveSocsErr] =
    useState<boolean>(false);

  useEffect(() => {
    Keyboard.dismiss();

    props.isFilterMenuOpen &&
      retrieveSocietyNames()
        .then((newSocItems) => {
          setSocItems(newSocItems);

          props.setSelectedSocItems((oldItems) =>
            newSocItems.filter((newItem) =>
              oldItems.some((selectedItem) => isEqual(newItem, selectedItem))
            )
          );

          setShowRetrieveSocsErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          isUndefined(socItems) && setShowRetrieveSocsErr(true);
        });
  }, [props.isFilterMenuOpen]);

  const handleSelectedSocItemsChange = (item: Item) => {
    props.setSelectedSocItems(xorBy(props.selectedSocItems, [item], "id"));
  };

  const updateDateRange = (
    momentDate: moment.Moment,
    type: "START_DATE" | "END_DATE"
  ) => {
    type === "START_DATE"
      ? props.setFilterStartDate(momentDate.toDate())
      : props.setFilterEndDate(momentDate?.toDate());
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
        {showRetrieveSocsErr ? (
          <ErrorAlert message="Couldn't retrieve society names. Try again later." />
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
          todayTextStyle={{ color: config.tokens.colors.black }}
          width={filterMenuSize}
        />
      </VStack>
    ),
    isOpen: props.isFilterMenuOpen,
    onChange: props.setIsFilterMenuOpen,
    bounceBackOnOverdraw: false,
    overlayColor: config.tokens.colors.tintBlack,
    openMenuOffset: filterMenuSize
  };

  return <SideMenu {...filterMenuProps}>{props.children}</SideMenu>;
}
