import { defaultDate } from "../helpers/DateTimeHelper";

export interface SocEvent {
  name: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date;
  pictureUrl: string;
}

export const defaultSocEvent: SocEvent = {
  name: "",
  location: "",
  description: "",
  startDate: defaultDate(),
  endDate: defaultDate(),
  pictureUrl: ""
};

export interface RetrieveSocEvent extends SocEvent {
  id: string;
}

export const defaultRetrieveSocEvent: RetrieveSocEvent = Object.assign(
  defaultSocEvent,
  { id: "" }
);

export interface CreateSocEvent extends SocEvent {
  localPictureUrl: string;
}

export const defaultCreateSocEvent: CreateSocEvent = Object.assign(
  defaultSocEvent,
  { localPictureUrl: "" }
);

export interface UpdateSocEvent extends Partial<CreateSocEvent> {
  id: string;
}
