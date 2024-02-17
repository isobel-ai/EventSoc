import SocietiesStackNavigator from "./SocietiesStackNavigator";
import SocietiesSideMenu from "./SocietiesSideMenu";

export default function SocietiesNavigator() {
  return (
    <SocietiesSideMenu>
      <SocietiesStackNavigator />
    </SocietiesSideMenu>
  );
}
