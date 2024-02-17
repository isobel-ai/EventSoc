import {
  FormControl,
  Input,
  InputField,
  FormControlError,
  FormControlErrorText,
  ButtonText,
  ScrollView,
  Button
} from "@gluestack-ui/themed";
import { isUndefined } from "lodash";
import React, { useState } from "react";
import { Keyboard } from "react-native";
import {
  validEmail,
  validPassword
} from "../../helpers/AuthInputValidationHelper";
import { register } from "../../services/authService";
import ErrorAlert from "../error/ErrorAlert";
import { config } from "../../../config/gluestack-ui.config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Input = {
  value: string;
  error: boolean;
};

const defaultInput = { value: "", error: true };

export default function RegisterForm() {
  const [name, setName] = useState<Input>(defaultInput);
  const [email, setEmail] = useState<Input>(defaultInput);
  const [password, setPassword] = useState<Input>(defaultInput);
  const [confirmPswd, setConfirmPswd] = useState<Input>(defaultInput);

  const [registerErrMsg, setRegisterErrMsg] = useState<string>();

  const handleRegistration = () => {
    Keyboard.dismiss();
    register(name.value, email.value, password.value)
      .then((errMsg) => errMsg !== undefined && setRegisterErrMsg(errMsg))
      .catch((err) => {
        console.error(err.message);
        setRegisterErrMsg("Something went wrong. Try again later.");
      });
  };

  return (
    <>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        backgroundColor={config.tokens.colors.inputSectionPink}
        width="80%"
        paddingVertical={10}
        borderRadius={15}
        maxHeight="60%"
        contentContainerStyle={{
          gap: 20,
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
        <FormControl
          width="90%"
          isInvalid={name.error}>
          <Input>
            <InputField
              placeholder="Name"
              backgroundColor={config.tokens.colors.white}
              onChangeText={(n) => setName({ value: n, error: !n })}
            />
          </Input>
          <FormControlError>
            <MaterialIcons
              name="error-outline"
              size={25}
              color={config.tokens.colors.error}
            />
            <FormControlErrorText>Name required.</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          width="90%"
          isInvalid={email.error}>
          <Input>
            <InputField
              placeholder="Email"
              backgroundColor={config.tokens.colors.white}
              onChangeText={(e) =>
                setEmail({ value: e, error: !validEmail(e) })
              }
            />
          </Input>
          <FormControlError>
            <MaterialIcons
              name="error-outline"
              size={25}
              color={config.tokens.colors.error}
            />
            <FormControlErrorText>
              {email.value ? "Invalid Warwick email" : "Email required"}.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          width="90%"
          isInvalid={password.error}>
          <Input>
            <InputField
              type="password"
              placeholder="Password"
              backgroundColor={config.tokens.colors.white}
              onChangeText={(p) =>
                setPassword({ value: p, error: !validPassword(p) })
              }
            />
          </Input>
          <FormControlError>
            <MaterialIcons
              name="error-outline"
              size={25}
              color={config.tokens.colors.error}
            />
            <FormControlErrorText>
              {password.value
                ? "Password must be at least 6 characters"
                : "Password required"}
              .
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          width="90%"
          isInvalid={confirmPswd.error}>
          <Input>
            <InputField
              type="password"
              placeholder="Confirm Password"
              backgroundColor={config.tokens.colors.white}
              onChangeText={(p) =>
                setConfirmPswd({ value: p, error: p !== password.value })
              }
            />
          </Input>
          <FormControlError>
            <MaterialIcons
              name="error-outline"
              size={25}
              color={config.tokens.colors.error}
            />
            <FormControlErrorText>Passwords must match.</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <Button
          size="xl"
          action={"positive"}
          width="80%"
          isDisabled={
            name.error || email.error || password.error || confirmPswd.error
          }
          onPress={handleRegistration}>
          <ButtonText>Register</ButtonText>
        </Button>
      </ScrollView>
      {!isUndefined(registerErrMsg) && (
        <ErrorAlert
          message={registerErrMsg}
          variant="solid"
          width="80%"
        />
      )}
    </>
  );
}
