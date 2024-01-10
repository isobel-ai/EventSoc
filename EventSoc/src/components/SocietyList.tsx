import {
  VStack,
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Divider
} from "@gluestack-ui/themed";
import { Society } from "../models/Society";
import SearchList from "./SearchList";
import { DimensionValue } from "react-native";
import SideMenuHeading from "./SideMenuHeading";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainTabParamList } from "../navigation/MainTabNavigator";

interface Props {
  title: string;
  societies: Society[];
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  maxHeight?: DimensionValue;
}

export default function SocietyList(props: Props) {
  const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();

  const selectSocietyPage = (socId: string) => {
    navigate("Societies", { screen: "Home", params: { societyId: socId } });
    props.setIsSideMenuOpen(false);
  };

  const renderSocietyButton = (soc: Society) => (
    <Button
      key={soc.id}
      variant="link"
      sx={{
        ":active": { _text: { textDecorationLine: "none" } }
      }}
      size="lg"
      width="100%"
      marginVertical={5}
      justifyContent="flex-start"
      onPress={() => selectSocietyPage(soc.id)}>
      <Avatar marginHorizontal={10}>
        <AvatarFallbackText
          color="white"
          fontSize="$sm">
          {soc.data.name}
        </AvatarFallbackText>
        {soc.data.pictureUrl && (
          <AvatarImage
            source={{ uri: soc.data.pictureUrl }}
            alt=""
          />
        )}
      </Avatar>
      <ButtonText
        numberOfLines={1}
        ellipsizeMode="tail">
        {soc.data.name}
      </ButtonText>
    </Button>
  );

  return (
    <VStack
      width="100%"
      maxHeight={props.maxHeight}>
      <SideMenuHeading heading={props.title} />
      <SearchList
        curvedSearchBar={false}
        data={props.societies}
        renderItem={renderSocietyButton}
        searchKeys={["data.name"]}
        clearSearch={[props.isSideMenuOpen]}
        itemSeperator={() => <Divider />}
        maxHeight="90%"
        listEmptyText="No societies"
      />
    </VStack>
  );
}
