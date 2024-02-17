import {
  CloseCircleIcon,
  Icon,
  Pressable,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack
} from "@gluestack-ui/themed";

export interface DismissableToastProps {
  title: string;
  description?: string;
}

type Props = DismissableToastProps & {
  id: any;
  close: () => void;
};

export default function DismissableToast(props: Props) {
  return (
    <Pressable
      onPress={props.close}
      maxWidth="95%"
      alignSelf="center">
      <Toast
        width="95%"
        alignSelf="center"
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
