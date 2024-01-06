import { ReactNode, useEffect, useState } from "react";
import { RetrieveSociety } from "../../models/Society";
import {
  AddIcon,
  Button,
  ButtonIcon,
  ButtonText,
  VStack
} from "@gluestack-ui/themed";
import {
  retrieveExecSocieties,
  retrieveSocieties
} from "../../services/societiesService";
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
  const { societies, setSocieties, navigatorRef } = useSocietiesContext();

  const [socErrMsg, setSocErrMsg] = useState<string>("");

  const [execSocieties, setExecSocieties] = useState<RetrieveSociety[]>([]);
  const [execSocErrMsg, setExecSocErrMsg] = useState<string>("");

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    retrieveExecSocieties().then((result) => {
      if (result instanceof Error) {
        setExecSocErrMsg(result.message);
      } else {
        setExecSocieties(result);
        setExecSocErrMsg("");
      }
    });
    retrieveSocieties().then((result) => {
      if (result instanceof Error) {
        setSocErrMsg(result.message);
      } else {
        setSocieties(result);
        setSocErrMsg("");
      }
    });
  }, [isVisible]);

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
        borderRightWidth="$2"
        height="100%"
        gap={18}>
        <SocietyList
          title="Exec Societies"
          societies={execSocieties}
          isSideMenuOpen={isVisible}
          setIsSideMenuOpen={setIsVisible}
          errMsg={execSocErrMsg}
          maxHeight="41%"
        />
        <SocietyList
          title="All Societies"
          societies={societies}
          isSideMenuOpen={isVisible}
          setIsSideMenuOpen={setIsVisible}
          errMsg={socErrMsg}
          maxHeight="47%"
        />
        <Button
          size={"xl"}
          borderRadius="$none"
          onPress={goToRegisterSocietyScreen}
          position="absolute"
          bottom={0}
          left={0}
          right={0}>
          <ButtonIcon
            as={AddIcon}
            size="xl"
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
