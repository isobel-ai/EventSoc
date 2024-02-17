import { Button, ButtonText, Divider, Heading } from "@gluestack-ui/themed";
import ScreenView from "../../components/general/ScreenView";
import { config } from "../../../config/gluestack-ui.config";
import { StackScreenProps } from "@react-navigation/stack";
import { LoginStackParamList } from "../../navigation/LoginStackNavigator";
import LoginForm from "../../components/login/LoginForm";

type Props = StackScreenProps<LoginStackParamList, "Login">;

export default function LoginScreen(props: Props) {
  return (
    <ScreenView
      extraStyle={{
        backgroundColor: config.tokens.colors.navigationLightPink,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 15
      }}>
      <Heading
        size="2xl"
        style={{ textAlign: "center" }}>
        Welcome to EventSoc
      </Heading>
      <LoginForm />
      <Divider
        my="$0.5"
        width="80%"
      />
      <Heading
        size="md"
        style={{ textAlign: "center" }}>
        Don&apos;t have an account?
      </Heading>
      <Button
        size="xl"
        width="80%"
        onPress={() => props.navigation.navigate("Register")}>
        <ButtonText>Register</ButtonText>
      </Button>
    </ScreenView>
  );
}
