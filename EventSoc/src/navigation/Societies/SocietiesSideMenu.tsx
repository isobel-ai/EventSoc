import { ReactNode, useEffect, useState } from "react";
import { RetrieveSociety } from "../../models/Society";
import { Heading, VStack } from "@gluestack-ui/themed";
import { retrieveAllAndExecSocieties } from "../../services/societiesService";
import SocietyList from "../../components/SocietyList";
import SideMenu, {
  ReactNativeSideMenuProps
} from "react-native-side-menu-updated";

interface Props {
  children: ReactNode;
}

export default function SocietiesSlideOverModal(props: Props) {
  const [execSocieties, setExecSocieties] = useState<RetrieveSociety[]>([]);
  const [societies, setSocieties] = useState<RetrieveSociety[]>([]);

  useEffect(
    () => retrieveAllAndExecSocieties(setSocieties, setExecSocieties),
    []
    // [props.isVisible]
  );

  const sideMenuProps: ReactNativeSideMenuProps = {
    menu: (
      <VStack
        backgroundColor="white"
        flex={1}>
        <Heading>Exec Societies</Heading>
        <SocietyList societies={execSocieties} />
        <Heading>All Societies</Heading>
        <SocietyList societies={societies} />
      </VStack>
    )
  };

  return <SideMenu {...sideMenuProps}>{props.children}</SideMenu>;
}
