import {
  ArrowLeftIcon,
  Button,
  ButtonIcon,
  ButtonText,
  Heading
} from "@gluestack-ui/themed";
import ScreenView from "../../components/general/ScreenView";
import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { LoginStackParamList } from "../../navigation/LoginStackNavigator";
import { config } from "../../config/gluestack-ui.config";
import RegisterForm from "../../components/login/RegisterForm";

type Props = StackScreenProps<LoginStackParamList, "Register">;

export default function RegisterScreen(props: Props) {
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
        position="absolute"
        top={50}
        left={5}
        sx={{
          ":active": { _text: { textDecorationLine: "none" } }
        }}
        onPress={props.navigation.goBack}>
        <ButtonIcon
          as={ArrowLeftIcon}
          size={"xl"}
        />
        <ButtonText style={{ paddingLeft: 5 }}>Back to Login</ButtonText>
      </Button>
      <Heading
        size="2xl"
        marginTop={80}
        style={{ textAlign: "center" }}>
        Welcome to EventSoc
      </Heading>
      <RegisterForm />
    </ScreenView>
  );
}
