import {
  VStack,
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Divider
} from "@gluestack-ui/themed";
import { Society } from "../../../Models/Society";
import SearchList from "./SearchList";
import { DimensionValue } from "react-native";
import SideMenuHeading from "./SideMenuHeading";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainTabParamList } from "../navigation/MainTabNavigator";
import { memo } from "react";
import SocietyButton from "./SocietyButton";

interface Props {
  title: string;
  societies: Society[];
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  height?: DimensionValue;
}

export default function SocietyList(props: Props) {
  const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();

  const selectSocietyPage = (socId: string) => {
    navigate("Societies", { screen: "Home", params: { societyId: socId } });
    props.setIsSideMenuOpen(false);
  };

  return (
    <VStack
      width="100%"
      height={props.height}>
      <SideMenuHeading heading={props.title} />
      <SearchList
        curvedSearchBar={false}
        data={props.societies}
        renderItem={(item) => (
          <SocietyButton
            society={item}
            onPress={() => selectSocietyPage(item.id)}
          />
        )}
        searchKeys={["data.name"]}
        clearSearch={[props.isSideMenuOpen]}
        itemSeperator={() => <Divider />}
        maxHeight="90%"
        listEmptyText="No societies"
      />
    </VStack>
  );
}
