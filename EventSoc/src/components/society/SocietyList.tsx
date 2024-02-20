import { VStack, Divider } from "@gluestack-ui/themed";
import SearchList from "../general/SearchList";
import { DimensionValue } from "react-native";
import SideMenuHeading from "../general/SideMenuHeading";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import SocietyListButton from "./SocietyListButton";
import { Name } from "../../../../Shared/models/Name";
import { MainTabParamList } from "../../navigation/MainTabNavigator";

type Props = {
  title: string;
  societies: Name[];
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (value: boolean) => void;
  height?: DimensionValue;
};

export default function SocietyList(props: Props) {
  const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();

  const handleSelectSocietyPage = (socId: string) => {
    navigate("Societies", { screen: "Society", params: { societyId: socId } });
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
          <SocietyListButton
            society={item}
            onPress={() => handleSelectSocietyPage(item.id)}
            imageReloadTrigger={props.isSideMenuOpen}
          />
        )}
        searchKeys={["name"]}
        clearSearchTriggers={[props.isSideMenuOpen]}
        itemSeperator={() => <Divider />}
        maxHeight="90%"
        listEmptyText="No societies"
      />
    </VStack>
  );
}
