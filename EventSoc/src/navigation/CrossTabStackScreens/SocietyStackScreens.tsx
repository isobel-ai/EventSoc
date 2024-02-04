import { ArrowLeftIcon, CloseIcon, Icon } from "@gluestack-ui/themed";
import { StackNavigationOptions } from "@react-navigation/stack";
import SocietiesScreen from "../../screens/SocietyStackScreens/SocietiesScreen";
import RegisterSocietyScreen from "../../screens/SocietyStackScreens/RegisterSocietyScreenn
import EditSocietyScreen from "../../screens/SocietyStackScreens/EditSocietyScreen";
import CreateEventScreen from "../../screens/SocietyStackScreens/CreateEventScreen";

export type SocietyStackParamList = {
  Society: { societyId: string };
  "Edit Society": { societyId: string };
  "Create Event": { organiserId: string };
};

export type SocietyStackScreenInfo = {
  name: keyof SocietyStackParamList;
  component: (props: any) => React.JSX.Element;
  options?: StackNavigationOptions;
};

export const SocietyStackScreens: SocietyStackScreenInfo[] = [
  {
    name: "Society",
    component: SocietiesScreen,
    options: {
      headerBackImage: () => (
        <Icon
          as={ArrowLeftIcon}
          size="xl"
          style={{ paddingLeft: 40 }}
          color="black"
        />
      )
    }
  },
  { name: "Edit Society", component: EditSocietyScreen },
  { name: "Create Event", component: CreateEventScreen }
];

export const societyStackScreenOptions: StackNavigationOptions = {
  headerBackTitleVisible: false,
  headerBackImage: () => (
    <Icon
      as={CloseIcon}
      size="xl"
      style={{ paddingLeft: 40 }}
    />
  )
};
