import {
  VStack,
  ScrollView,
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  AvatarImage
} from "@gluestack-ui/themed";
import { useSocietiesContext } from "../contexts/SocietiesContext";
import { RetrieveSociety } from "../models/Society";

interface Props {
  societies: RetrieveSociety[];
  setIsSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SocietyList(props: Props) {
  const { setSelectedSoc, navigatorRef } = useSocietiesContext();

  const selectSocietyPage = (soc: RetrieveSociety) => {
    setSelectedSoc(soc);
    navigatorRef.current.navigate("Home");
    props.setIsSideMenuOpen(false);
  };

  return (
    <ScrollView scrollsToTop={false}>
      <VStack>
        {props.societies.map((soc) => {
          return (
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
          );
        })}
      </VStack>
    </ScrollView>
  );
}
