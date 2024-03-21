import {
  Button,
  ButtonIcon,
  CloseCircleIcon,
  HStack,
  Text
} from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";

type Props = {
  interest: string;
  deleteInterest: () => void;
};

export default function InterestListButton(props: Props) {
  return (
    <HStack
      width="100%"
      alignItems="center">
      <Text
        fontSize={"$lg"}
        padding={10}>
        {props.interest}
      </Text>
      <Button
        variant="link"
        position="absolute"
        right={15}
        onPress={props.deleteInterest}>
        <ButtonIcon
          as={CloseCircleIcon}
          color={config.tokens.colors.error}
          size="xl"
        />
      </Button>
    </HStack>
  );
}
