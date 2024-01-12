import { ReactNode, useEffect, useState } from "react";
import { Society } from "../../models/Society";
import {
  AddIcon,
  Alert,
  AlertText,
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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  children: ReactNode;
}

export default function SocietiesSideMenu(props: Props) {
  const { societies, updateSocieties, getUser } = useAppContext();

  const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();

  const getExecSocieties = () => {
    const userName = getUser()?.data.name;
    return userName
      ? societies.filter((soc) => soc.data.exec.includes(userName))
      : [];
  };

  const [execSocieties, setExecSocieties] =
    useState<Society[]>(getExecSocieties);

  const [updateSocsErrMsg, setUpdateSocsErrMsg] = useState<string>("");

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    isVisible &&
      updateSocieties()
        .then(() => {
          setExecSocieties(getExecSocieties);
          setUpdateSocsErrMsg("");
        })
        .catch((err) => !societies.length && setUpdateSocsErrMsg(err.message));
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
        {updateSocsErrMsg ? (
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
            <AlertText>{updateSocsErrMsg}</AlertText>
          </Alert>
        ) : (
          <>
            <SocietyList
              title="Exec Societies"
              societies={execSocieties}
              isSideMenuOpen={isVisible}
              setIsSideMenuOpen={setIsVisible}
              maxHeight="41%"
            />
            <SocietyList
              title="All Societies"
              societies={societies}
              isSideMenuOpen={isVisible}
              setIsSideMenuOpen={setIsVisible}
              maxHeight="47%"
            />
          </>
        )}
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
