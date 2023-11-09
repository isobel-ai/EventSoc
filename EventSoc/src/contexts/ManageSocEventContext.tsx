import { createContext, useContext } from "react";
import { RetrieveSocEvent, defaultRetrieveSocEvent } from "../models/SocEvent";

type ManageEventContent = {
  toEditEvent: RetrieveSocEvent;
  setToEditEvent: React.Dispatch<React.SetStateAction<RetrieveSocEvent>>;

  eventDeleted: boolean;
  setEventDeleted: React.Dispatch<React.SetStateAction<boolean>>;
};

const ManageSocEventContext = createContext<ManageEventContent>({
  toEditEvent: defaultRetrieveSocEvent,
  setToEditEvent: () => {},
  eventDeleted: false,
  setEventDeleted: () => {}
});
export default ManageSocEventContext;

export const useManageSocEventContext = () => useContext(ManageSocEventContext);
