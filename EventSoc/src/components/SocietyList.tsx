import {
  VStack,
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Text,
  Divider,
  Heading
} from "@gluestack-ui/themed";
import { useSocietiesContext } from "../contexts/SocietiesContext";
import { RetrieveSociety } from "../models/Society";
import SearchableList from "./SearchableList";
import { config } from "../../config/gluestack-ui.config";
import { DimensionValue } from "react-native";

interface Props {
  title: string;
  societies: RetrieveSociety[];
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  maxHeight?: DimensionValue;
}

export default function SocietyList(props: Props) {
  const { setSelectedSoc, navigatorRef } = useSocietiesContext();

  const selectSocietyPage = (soc: RetrieveSociety) => {
    setSelectedSoc(soc);
    navigatorRef.current.navigate("Home");
    props.setIsSideMenuOpen(false);
  };

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
      {props.societies.length > 0 ? (
        <SearchableList
          curvedSearchBar={false}
          data={props.societies}
          renderItem={(soc) => (
            <Button
              key={soc.id}
              variant={"link"}
              size="lg"
              width="100%"
              style={soc.pictureUrl ? { justifyContent: "flex-start" } : {}}
              onPress={() => selectSocietyPage(soc)}>
              {soc.pictureUrl && (
                <Avatar>
                  <AvatarFallbackText>{soc.name.charAt(0)}</AvatarFallbackText>
                  <AvatarImage
                    source={{ uri: soc.pictureUrl }}
                    alt=""
                    style={{ left: -10 }}
                  />
                </Avatar>
              )}
              <ButtonText ellipsizeMode="tail">{soc.name}</ButtonText>
            </Button>
          )}
          clearSearch={props.isSideMenuOpen}
          itemSeperator={() => <Divider />}
          maxHeight="90%"
        />
      ) : (
        <Text fontSize={"$lg"}>No societies</Text>
      )}
    </VStack>
  );
}
