import SlideOverModal from "./SlideOverModal";
import { Heading } from "@gluestack-ui/themed";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SocietiesSlideOverModal(props: Props) {
  return (
    <SlideOverModal {...props}>
      <Heading>hk</Heading>
    </SlideOverModal>
  );
}
