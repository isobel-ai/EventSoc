import { createContext, useContext } from "react";

export type DeleteEventContent = {
  onDeleteEvent: () => void;
};

const DeleteEventContext = createContext<DeleteEventContent>({
  onDeleteEvent: () => {}
});
export default DeleteEventContext;

export const useDeleteEventContext = () => useContext(DeleteEventContext);
