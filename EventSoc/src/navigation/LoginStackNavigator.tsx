import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Login/RegisterScreen";

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
};

export default function LoginStackNavigator() {
  const Stack = createStackNavigator<LoginStackParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
