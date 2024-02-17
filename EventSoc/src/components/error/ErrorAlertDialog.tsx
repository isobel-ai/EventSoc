import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  Button,
  HStack,
  Heading,
  AlertDialogCloseButton,
  Icon,
  CloseIcon,
  AlertDialogBody,
  AlertDialogFooter,
  ButtonText,
  Text
} from "@gluestack-ui/themed";
import { config } from "../../../config/gluestack-ui.config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type ErrDialogState = {
  message: string;
  showDialog: boolean;
};

export const defaultErrDialogState = {
  message: "",
  showDialog: false
};

type Props = {
  errDialogState: ErrDialogState;
  setErrDialogState: (state: ErrDialogState) => void;

  onClose?: () => void;
};

export default function ErrorAlertDialog(props: Props) {
  const setShowDialog = (value: boolean) => {
    props.setErrDialogState({ ...props.errDialogState, showDialog: value });
  };

  const handleClose = () => {
    setShowDialog(false);
    props.onClose && props.onClose();
  };

  return (
    <AlertDialog
      isOpen={props.errDialogState.showDialog}
      onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <HStack style={{ gap: 20 }}>
            <MaterialIcons
              name="error-outline"
              size={40}
              color={config.tokens.colors.error}
              style={{ top: 5 }}
            />
            <Heading size="xl">Error</Heading>
          </HStack>
          <AlertDialogCloseButton>
            <Icon
              as={CloseIcon}
              size="xl"
            />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="md">{props.errDialogState.message}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={handleClose}>
            <ButtonText>OK</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
