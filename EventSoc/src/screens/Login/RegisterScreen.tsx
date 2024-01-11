import {
  Alert,
  AlertText,
  ArrowLeftIcon,
  Button,
  ButtonIcon,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Heading,
  Input,
  InputField,
  ScrollView
} from "@gluestack-ui/themed";
import ScreenView from "../../components/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import { LoginStackParamList } from "../../navigation/LoginStackNavigator";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../../config/gluestack-ui.config";
import {
  validEmail,
  validPassword
} from "../../helpers/AuthInputValidationHelper";
import { register } from "../../services/authService";

interface Input {
  value: string;
  error: boolean;
}
const defaultInput = { value: "", error: true };

type Props = StackScreenProps<LoginStackParamList, "Register">;

export default function RegisterScreen(props: Props) {
  const [name, setName] = useState<Input>(defaultInput);
  const [email, setEmail] = useState<Input>(defaultInput);
  const [password, setPassword] = useState<Input>(defaultInput);
  const [confirmPswd, setConfirmPswd] = useState<Input>(defaultInput);

  const [errorMsg, setErrMsg] = useState<string>("");

  return (
    <ScreenView
      extraStyle={{
        backgroundColor: config.tokens.colors.navigationLightPink,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 15
      }}>
      <Button
        variant={"link"}
        size={"lg"}
        top={-5}
        left={-100}
        onPress={props.navigation.goBack}>
        <ButtonIcon
          as={ArrowLeftIcon}
          size={"xl"}
        />
        <ButtonText style={{ paddingLeft: 5 }}>Back to Login</ButtonText>
      </Button>
      <Heading
        size="2xl"
        style={{ textAlign: "center" }}>
        Welcome to EventSoc
      </Heading>
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
              backgroundColor="white"
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
              backgroundColor="white"
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
              backgroundColor="white"
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
              backgroundColor="white"
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
          onPress={() =>
            register(name.value, email.value, password.value).catch((err) =>
              setErrMsg(err.message)
            )
          }>
          <ButtonText>Register</ButtonText>
        </Button>
      </ScrollView>
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
    </ScreenView>
  );
}
