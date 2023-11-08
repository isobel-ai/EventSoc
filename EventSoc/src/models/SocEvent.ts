export interface SocEvent {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  hasPicture: boolean;
}

export interface RetrieveSocEvent {
  id: string;
  socEvent: SocEvent;
}

export interface CreateSocEvent {
  socEvent: SocEvent;
  pictureURL: string;
}
