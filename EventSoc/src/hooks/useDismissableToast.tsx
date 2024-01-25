import { useToast } from "@gluestack-ui/themed";
import DismissableToast, {
  DismissableToastProps
} from "../components/DismissableToast";

export default function useDismissableToast(props: DismissableToastProps) {
  const toast = useToast();

  const showToast = () =>
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
