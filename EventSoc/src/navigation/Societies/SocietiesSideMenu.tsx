import { ReactNode, useEffect, useState } from "react";
import { RetrieveSociety } from "../../models/Society";
import {
  AddIcon,
  Button,
  ButtonIcon,
  ButtonText,
  Heading,
  VStack
} from "@gluestack-ui/themed";
import { retrieveAllAndExecSocieties } from "../../services/societiesService";
import SocietyList from "../../components/SocietyList";
import SideMenu, {
  ReactNativeSideMenuProps
} from "react-native-side-menu-updated";
import { config } from "../../../config/gluestack-ui.config";
import { useSocietiesContext } from "../../contexts/SocietiesContext";

interface Props {
  children: ReactNode;
}

export default function SocietiesSideMenu(props: Props) {
  const { navigatorRef } = useSocietiesContext();

  const [execSocieties, setExecSocieties] = useState<RetrieveSociety[]>([]);
  const [societies, setSocieties] = useState<RetrieveSociety[]>([]);

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    isVisible && retrieveAllAndExecSocieties(setSocieties, setExecSocieties);
  }, [isVisible]);

  const MenuHeading = ({ title }: { title: string }) => (
    <Heading
      backgroundColor={config.tokens.colors.secondary200}
      width="100%"
      textAlign="center">
      {title}
    </Heading>
  );

  const goToRegisterSocietyScreen = () => {
    navigatorRef.current.navigate("Register Society");
    setIsVisible(false);
  };

  const sideMenuProps: ReactNativeSideMenuProps = {
    menu: (
      <VStack
        backgroundColor="white"
        flex={1}
        borderRightColor="black"
        borderRightWidth="$2">
        <MenuHeading title="Exec Societies" />
        <SocietyList
          societies={execSocieties}
          setIsSideMenuOpen={setIsVisible}
        />
        <MenuHeading title="All Societies" />
        <SocietyList
          societies={societies}
          setIsSideMenuOpen={setIsVisible}
        />
        <Button
          size={"xl"}
          width="100%"
          borderRadius="$none"
          onPress={goToRegisterSocietyScreen}>
          <ButtonIcon
            as={AddIcon}
            size="lg"
            style={{ left: -10 }}
          />
          <ButtonText>Register Society</ButtonText>
        </Button>
      </VStack>
    ),
    isOpen: isVisible,
    onChange: () => setIsVisible(!isVisible),
    bounceBackOnOverdraw: false,
    overlayColor: config.tokens.colors.tintBlack
  };

  return <SideMenu {...sideMenuProps}>{props.children}</SideMenu>;
}
