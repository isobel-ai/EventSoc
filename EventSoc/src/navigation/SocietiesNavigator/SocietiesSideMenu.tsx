import { ReactNode, useEffect, useState } from "react";
import {
  AddIcon,
  Button,
  ButtonIcon,
  ButtonText,
  VStack
} from "@gluestack-ui/themed";
import SocietyList from "../../components/society/SocietyList";
import SideMenu, {
  ReactNativeSideMenuProps
} from "react-native-side-menu-updated";
import { config } from "../../config/gluestack-ui.config";
import { useUserContext } from "../../contexts/UserContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SocietiesStackParamList } from "./SocietiesStackNavigator";
import { Name } from "../../../../Shared/models/Name";
import ErrorAlert from "../../components/error/ErrorAlert";
import { retrieveUserExecMemberSocieties } from "../../services/user/userExecMemberSocietiesService";
import { retrieveSocietyNames } from "../../services/namesService";

type ErrState = {
  isExecSocsErr: boolean;
  isSocsErr: boolean;
};

const defaultErrState: ErrState = { isExecSocsErr: false, isSocsErr: false };

type Props = {
  children: ReactNode;
};

export default function SocietiesSideMenu(props: Props) {
  const { userId } = useUserContext();

  const { navigate } = useNavigation<NavigationProp<SocietiesStackParamList>>();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [execSocieties, setExecSocieties] = useState<Name[]>([]);
  const [societies, setSocieties] = useState<Name[]>([]);

  const [showRetrieveSocsErr, setShowRetrieveSocsErr] =
    useState<ErrState>(defaultErrState);

  useEffect(() => {
    if (isVisible) {
      retrieveUserExecMemberSocieties(userId)
        .then((newExecSocs) => {
          setExecSocieties(newExecSocs);
          setShowRetrieveSocsErr((err) => {
            return { ...err, isExecSocsErr: false };
          });
        })
        .catch((err) => {
          console.error(err.message);
          execSocieties.length === 0 &&
            setShowRetrieveSocsErr((err) => {
              return { ...err, isExecSocsErr: true };
            });
        });

      retrieveSocietyNames()
        .then((newSocs) => {
          setSocieties(newSocs);
          setShowRetrieveSocsErr((err) => {
            return { ...err, isSocsErr: false };
          });
        })
        .catch((err) => {
          console.error(err.message);
          societies.length === 0 &&
            setShowRetrieveSocsErr((err) => {
              return { ...err, isSocsErr: true };
            });
        });
    }
  }, [isVisible]);

  const goToRegisterSocietyScreen = () => {
    navigate("Register Society");
    setIsVisible(false);
  };

  const sideMenuProps: ReactNativeSideMenuProps = {
    menu: (
      <VStack
        backgroundColor={config.tokens.colors.white}
        flex={1}
        borderRightColor={config.tokens.colors.black}
        borderRightWidth="$2"
        height="100%">
        {showRetrieveSocsErr.isExecSocsErr && showRetrieveSocsErr.isSocsErr ? (
          <ErrorAlert message="Couldn't retrieve societies. Try again later." />
        ) : (
          <>
            <SocietyList
              title="Exec Societies"
              societies={execSocieties}
              isSideMenuOpen={isVisible}
              setIsSideMenuOpen={setIsVisible}
              height="33%"
            />
            <SocietyList
              title="All Societies"
              societies={societies}
              isSideMenuOpen={isVisible}
              setIsSideMenuOpen={setIsVisible}
              height="60%"
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
