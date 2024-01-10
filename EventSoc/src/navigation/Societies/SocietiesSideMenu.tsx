import { ReactNode, useEffect, useState } from "react";
import { Society } from "../../models/Society";
import {
  AddIcon,
  Button,
  ButtonIcon,
  ButtonText,
  VStack
} from "@gluestack-ui/themed";
import SocietyList from "../../components/SocietyList";
import SideMenu, {
  ReactNativeSideMenuProps
} from "react-native-side-menu-updated";
import { config } from "../../../config/gluestack-ui.config";
import { useAppContext } from "../../contexts/AppContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainTabParamList } from "../MainTabNavigator";

interface Props {
  children: ReactNode;
}

export default function SocietiesSideMenu(props: Props) {
  const { societies, updateSocieties, getUser } = useAppContext();

  const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();

  const [socErrMsg, setSocErrMsg] = useState<string>("");

  const [execSocieties, setExecSocieties] = useState<RetrieveSociety[]>([]);
  const [execSocErrMsg, setExecSocErrMsg] = useState<string>("");

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    isVisible &&
      updateSocieties().then((result) => {
      if (result instanceof Error) {
          setUpdateSocsErrMsg(result.message);
      } else {
          const userName = getUser()?.data.name;
          setExecSocieties(
            userName
              ? societies.filter((soc) => soc.data.exec.includes(userName))
              : []
          );
          setUpdateSocsErrMsg("");
      }
    });
  }, [isVisible]);

  const goToRegisterSocietyScreen = () => {
    navigate("Societies", { screen: "Register Society" });
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
