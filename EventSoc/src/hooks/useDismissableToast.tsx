import { useToast } from "@gluestack-ui/themed";
import DismissableToast, {
  DismissableToastProps
} from "../components/DismissableToast";

export default function useDismissableToast() {
  const toast = useToast();

  const showToast = (props: DismissableToastProps) =>
    toast.show({
      placement: "top",
      render: ({ id }) => (
        <DismissableToast
          id={id}
          close={() => toast.close(id)}
          {...props}
        />
      )
    });

  return showToast;
}
