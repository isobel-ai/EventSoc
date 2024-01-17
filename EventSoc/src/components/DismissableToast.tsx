import {
  CheckIcon,
  CloseCircleIcon,
  CloseIcon,
  Icon,
  Pressable,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast
} from "@gluestack-ui/themed";

export interface DismissableToastHookProps {
  id: any;
  close: () => void;
}

interface Props extends DismissableToastHookProps {
  title: string;
  description?: string;
}

export default function DismissableToast(props: Props) {
  return (
    <Pressable onPress={props.close}>
      <Toast
        nativeID={props.id}
        bg="$error">
        <Icon
          as={CloseCircleIcon}
          color="$white"
          size="lg"
          alignSelf="center"
          marginRight={10}
        />
        <VStack>
          <ToastTitle
            color="$textLight50"
            alignSelf="flex-start">
            {props.title}
          </ToastTitle>
          {props.description && (
            <ToastDescription color="$textLight50">
              {props.description}
            </ToastDescription>
          )}
        </VStack>
      </Toast>
    </Pressable>
  );
}
