import {
  VStack,
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Text,
  Divider,
  Heading,
  AlertText,
  Alert
} from "@gluestack-ui/themed";
import { Society } from "../models/Society";
import SearchList from "./SearchList";
import { DimensionValue } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SideMenuHeading from "./SideMenuHeading";

interface Props {
  title: string;
  societies: Society[];
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errMsg: string;
  maxHeight?: DimensionValue;
}

export default function SocietyList(props: Props) {
  const { navigatorRef } = useSocietiesContext();

  const selectSocietyPage = (socId: string) => {
    navigatorRef.current.navigate("Home", { societyId: socId });
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
      {!props.errMsg ? (
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
      ) : (
        <Alert
          action="error"
          variant="solid"
          width="90%"
          marginTop={15}>
          <MaterialIcons
            name="error-outline"
            size={40}
            color={config.tokens.colors.error}
            style={{ paddingRight: 15 }}
          />
          <AlertText>{props.errMsg}</AlertText>
        </Alert>
      )}
    </VStack>
  );
}
