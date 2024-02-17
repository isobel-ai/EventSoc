import { createContext, useContext } from "react";

export type OnDeleteEventContent = {
  onDeleteEvent: () => void;
};

const OnDeleteEventContext = createContext<OnDeleteEventContent>({
  onDeleteEvent: () => {}
});
export default OnDeleteEventContext;

export const useOnDeleteEventContext = () => useContext(OnDeleteEventContext);
