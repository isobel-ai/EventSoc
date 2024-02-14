import {
  VStack,
  FormControl,
  Input,
  InputField,
  ButtonText,
  Button
} from "@gluestack-ui/themed";
import { Keyboard } from "react-native";
import { config } from "../../../config/gluestack-ui.config";
import { signIn } from "../../services/authService";
import { isUndefined } from "lodash";
import { useEffect, useState } from "react";
import {
  validEmail,
  validPassword
} from "../../helpers/AuthInputValidationHelper";
import ErrorAlert from "../error/ErrorAlert";
import { useIsFocused } from "@react-navigation/native";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loginErrMsg, setLoginErrMsg] = useState<string>();

  const validEntries = validEmail(email) && validPassword(password);

  const isFocused = useIsFocused();

  useEffect(() => {
    !isFocused && setEmail(""), setPassword(""), setLoginErrMsg(undefined);
  }, [isFocused]);

  const handleSignIn = () => {
    Keyboard.dismiss();
    signIn(email, password)
      .then((result) => !result && setLoginErrMsg("Invalid login details."))
      .catch((err) => {
        console.error(err.message);
        setLoginErrMsg("Something went wrong. Try again later.");
      });
  };

  return (
    <>
      <VStack
        gap={20}
        backgroundColor={config.tokens.colors.inputSectionPink}
        width="80%"
        paddingVertical={10}
        borderRadius={15}>
        <FormControl width="80%">
          <Input>
            <InputField
              placeholder="Warwick Email"
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
          action="positive"
          width="80%"
          isDisabled={!validEntries}
          onPress={handleSignIn}>
          <ButtonText>Login</ButtonText>
        </Button>
      </VStack>
      {!isUndefined(loginErrMsg) && (
        <ErrorAlert
          message={loginErrMsg}
          variant="solid"
          width="80%"
        />
      )}
    </>
  );
}
