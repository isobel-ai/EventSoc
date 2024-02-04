import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginStackScreens/LoginScreen";
import RegisterScreen from "../screens/LoginStackScreens/RegisterScreen";

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
};

export default function LoginStackNavigator() {
  const Stack = createStackNavigator<LoginStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
}
