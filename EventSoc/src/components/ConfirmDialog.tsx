import {
  Button,
  Alert,
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
  AlertText,
  Text
} from "@gluestack-ui/themed";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { config } from "../../config/gluestack-ui.config";

interface Props {
  confirmFunc: () => Promise<any>;

  heading: string;
  body: string;
  confirmText?: string;

  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ConfirmDialog(props: Props) {
  const [confirmFuncErrorMsg, setConfirmFuncErrorMsg] = useState<string>("");

  const handleDialogClose = () => {
    props.setIsVisible(false);
    setConfirmFuncErrorMsg("");
  };

  const handleConfirm = () => {
    props
      .confirmFunc()
      .then(handleDialogClose)
      .catch((err) => {
        setConfirmFuncErrorMsg(err.message);
      });
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
            {confirmFuncErrorMsg && (
              <Alert
                action="error"
                variant="outline"
                width="95%">
                <MaterialIcons
                  name="error-outline"
                  size={40}
                  color={config.tokens.colors.error}
                  style={{ paddingRight: 15 }}
                />
                <AlertText>{confirmFuncErrorMsg}</AlertText>
              </Alert>
            )}
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
