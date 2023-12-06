import {
  Alert,
  AlertText,
  Button,
  ButtonText,
  Divider,
  FormControl,
  Heading,
  Input,
  InputField,
  VStack
} from "@gluestack-ui/themed";
import ScreenView from "../../components/ScreenView";
import { config } from "../../../config/gluestack-ui.config";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { login } from "../../services/authService";
import { StackScreenProps } from "@react-navigation/stack";
import { LoginStackParamList } from "../../navigation/LoginStackNavigator";
import {
  validEmail,
  validPassword
} from "../../helpers/AuthInputValidationHelper";

type Props = StackScreenProps<LoginStackParamList, "Login">;

export default function LoginScreen(props: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMsg, setErrMsg] = useState<string>("");

  const [validEntries, setValidEntries] = useState<boolean>(false);
  useEffect(
    () => setValidEntries(validEmail(email) && validPassword(password)),
    [email, password]
  );

  const handleRegistration = () => {
    props.navigation.navigate("Register");
    setEmail("");
    setPassword("");
  };

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
      <VStack
        gap={20}
        backgroundColor={config.tokens.colors.inputSectionPink}
        width="80%"
        paddingVertical={10}
        borderRadius={15}>
        <FormControl width="80%">
          <Input>
            <InputField
              placeholder="Email"
              backgroundColor="white"
              value={email}
              onChangeText={(t) => setEmail(t)}
            />
          </Input>
        </FormControl>
        <FormControl width="80%">
          <Input>
            <InputField
              type="password"
              placeholder="Password"
              backgroundColor="white"
              value={password}
              onChangeText={(p) => setPassword(p)}
            />
          </Input>
        </FormControl>
        <Button
          size="xl"
          action={"positive"}
          width="80%"
          isDisabled={!validEntries}
          onPress={() => login(email, password, setErrMsg)}>
          <ButtonText>Login</ButtonText>
        </Button>
      </VStack>
      {errorMsg && (
        <Alert
          action="error"
          variant="solid"
          width="80%">
          <MaterialIcons
            name="error-outline"
            size={40}
            color={config.tokens.colors.error}
            style={{ paddingRight: 5 }}
          />
          <AlertText>{errorMsg}</AlertText>
        </Alert>
      )}
      <Divider
        my="$0.5"
        width="80%"
      />
      <Heading
        size="md"
        style={{ textAlign: "center" }}>
        {"Don't have an account?"}
      </Heading>
      <Button
        size="xl"
        width="80%"
        onPress={handleRegistration}>
        <ButtonText>Register</ButtonText>
      </Button>
    </ScreenView>
  );
}
