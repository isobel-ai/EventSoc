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
import { useSocietiesContext } from "../contexts/SocietiesContext";
import { RetrieveSociety } from "../models/Society";
import SearchList from "./SearchList";
import { config } from "../../config/gluestack-ui.config";
import { DimensionValue } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  title: string;
  societies: RetrieveSociety[];
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errMsg: string;
  maxHeight?: DimensionValue;
}

export default function SocietyList(props: Props) {
  const { setSelectedSoc, navigatorRef } = useSocietiesContext();

  const selectSocietyPage = (soc: RetrieveSociety) => {
    setSelectedSoc(soc);
    navigatorRef.current.navigate("Home");
    props.setIsSideMenuOpen(false);
  };

  const renderSocietyButton = (soc: RetrieveSociety) => (
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
      onPress={() => selectSocietyPage(soc)}>
      <Avatar marginHorizontal={10}>
        <AvatarFallbackText
          color="white"
          fontSize="$sm">
          {soc.name}
        </AvatarFallbackText>
        {soc.pictureUrl && (
          <AvatarImage
            source={{ uri: soc.pictureUrl }}
            alt=""
          />
        )}
      </Avatar>
      <ButtonText
        numberOfLines={1}
        ellipsizeMode="tail">
        {soc.name}
      </ButtonText>
    </Button>
  );

  return (
    <VStack
      width="100%"
      maxHeight={props.maxHeight}>
      <Heading
        backgroundColor={config.tokens.colors.secondary200}
        width="100%"
        textAlign="center">
        {props.title}
      </Heading>
      {!props.errMsg ? (
        props.societies.length > 0 ? (
          <SearchList
            curvedSearchBar={false}
            data={props.societies}
            renderItem={renderSocietyButton}
            searchKeys={["name"]}
            clearSearch={[props.isSideMenuOpen]}
            itemSeperator={() => <Divider />}
            maxHeight="90%"
          />
        ) : (
          <Text fontSize={"$lg"}>No societies</Text>
        )
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
