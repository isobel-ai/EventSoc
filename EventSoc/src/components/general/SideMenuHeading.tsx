import { Heading } from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";

type Props = {
  heading: string;
};

export default function SideMenuHeading(props: Props) {
  return (
    <Heading
      backgroundColor={config.tokens.colors.secondary200}
      width="100%"
      textAlign="center">
      {props.heading}
    </Heading>
  );
}
