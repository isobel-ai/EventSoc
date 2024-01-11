import { defaultDate } from "../helpers/DateTimeHelper";

export interface Event {
  id: string;
  data: EventData;
}

export interface EventData {
  name: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date;
  pictureUrl: string;
  tags: string[];
  organiserId: string;
}

export const defaultEventData: () => EventData = () => {
  return {
    name: "",
    location: "",
    description: "",
    startDate: defaultDate(),
    endDate: defaultDate(),
    pictureUrl: "",
    tags: <string[]>[],
    organiserId: ""
  };
};
