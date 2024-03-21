import {
  Button,
  Icon,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  HStack,
  Heading,
  AlertDialogCloseButton,
  CloseIcon,
  AlertDialogBody,
  AlertDialogFooter,
  VStack,
  ButtonText,
  Text
} from "@gluestack-ui/themed";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../config/gluestack-ui.config";
import ErrorAlert from "../error/ErrorAlert";

type Props = {
  confirmFunc: () => Promise<any>;

  heading: string;
  body: string;
  confirmText?: string;

  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConfirmDialog(props: Props) {
  const [confirmFuncErrMsg, setConfirmFuncErrMsg] = useState<string>();

  const handleDialogClose = () => {
    props.setIsVisible(false);
    setConfirmFuncErrMsg(undefined);
  };

  const handleConfirm = () => {
    props
      .confirmFunc()
      .then(handleDialogClose)
      .catch((err) => setConfirmFuncErrMsg(err.message));
  };

  return (
    <AlertDialog
      isOpen={props.isVisible}
      onClose={handleDialogClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent width="90%">
        <AlertDialogHeader>
          <HStack style={{ gap: 10 }}>
            <MaterialIcons
              name="warning"
              size={40}
              color={config.tokens.colors.warningYellow}
            />
            <Heading size="lg">{props.heading}</Heading>
          </HStack>
          <AlertDialogCloseButton>
            <Icon
              as={CloseIcon}
              size="xl"
            />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="md">{props.body}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <VStack
            width="100%"
            gap={15}>
            <HStack gap={55}>
              <Button
                variant="outline"
                action="secondary"
                onPress={handleDialogClose}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={handleConfirm}>
                <ButtonText>{props.confirmText ?? "Confirm"}</ButtonText>
              </Button>
            </HStack>
            {confirmFuncErrMsg && <ErrorAlert message={confirmFuncErrMsg} />}
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
