import { ReactNode } from "react";
import Modal from "react-native-modal";

interface Props {
  children: ReactNode;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SlideOverModal(props: Props) {
  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={() => props.setIsVisible(false)}
      animationIn="slideInLeft"
      animationOut="slideOutLeft">
      {props.children}
    </Modal>
  );
}
