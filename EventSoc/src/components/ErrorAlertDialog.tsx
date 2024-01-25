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
import { config } from "../../config/gluestack-ui.config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;

  errMsg: string;

  onClose?: () => void;
}

export default function ErrorAlertDialog(props: Props) {
  const handleClose = () => {
    props.setIsVisible(false);
    props.onClose && props.onClose();
  };

  return (
    <AlertDialog
      isOpen={props.isVisible}
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
          <Text size="md">{props.errMsg}</Text>
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
