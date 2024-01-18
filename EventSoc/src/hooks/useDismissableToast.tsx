import { useToast } from "@gluestack-ui/themed";
import { ReactNode } from "react";
import { DismissableToastHookProps } from "../components/DismissableToast";

export default function useDismissableToast(
  ToastElement: (props: DismissableToastHookProps) => ReactNode
) {
  const toast = useToast();

  const showToast = () =>
    toast.show({
      placement: "top",
      render: ({ id }) => (
        <ToastElement
          id={"toast-" + id}
          close={() => toast.close(id)}
        />
      )
    });

  return showToast;
}
