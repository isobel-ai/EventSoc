export interface SocEvent {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  hasPicture: boolean;
}

export const defaultSocEvent: SocEvent = {
  name: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  hasPicture: false
};

export interface RetrieveSocEvent {
  id: string;
  socEvent: SocEvent;
}

export interface CreateSocEvent {
  socEvent: SocEvent;
  pictureURL: string;
}

export const defaultCreateSocEvent: CreateSocEvent = {
  socEvent: defaultSocEvent,
  pictureURL: ""
};
