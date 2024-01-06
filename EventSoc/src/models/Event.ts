import { DocumentReference } from "firebase/firestore";
import { defaultDate } from "../helpers/DateTimeHelper";

export interface Event {
  name: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date;
  pictureUrl: string;
  organiserRef: DocumentReference;
}

export const defaultEvent: () => Event = () => {
  return {
    name: "",
    location: "",
    description: "",
    startDate: defaultDate(),
    endDate: defaultDate(),
    pictureUrl: "",
    organiserRef: <DocumentReference>(<unknown>null)
  };
};

export interface RetrieveEvent extends Event {
  id: string;
}

export const defaultRetrieveEvent: () => RetrieveEvent = () =>
  Object.assign(defaultEvent(), { id: "" });

export interface CreateEvent extends Event {
  localPictureUrl: string;
}

export const defaultCreateEvent: () => CreateEvent = () =>
  Object.assign(defaultEvent(), { localPictureUrl: "" });

export interface UpdateEvent extends Partial<CreateEvent> {
  id: string;
}
