import { SocietyOverview, defaultSocietyOverview } from "./Society";

export type EventDoc = {
  id: string;
  data: EventData;
};

export type EventDocAndRecScore = EventDoc & { score: number };

// If this changes, update eventDetailKeys accordingly
export type EventData = {
  name: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tags: string[];
  organiser: SocietyOverview;
  capacity: number; // -1 = unlimited capacity
  attendance: number;
  ticketPrice: number;
};

export function defaultEventData(): EventData {
  const defaultDate = () => {
    const defaultDate = new Date();
    defaultDate.setSeconds(0, 0);
    return defaultDate;
  };

  return {
    name: "",
    location: "",
    description: "",
    startDate: defaultDate(),
    endDate: defaultDate(),
    tags: <string[]>[],
    organiser: defaultSocietyOverview(),
    capacity: -1,
    attendance: 0,
    ticketPrice: 0,
  };
}

export const eventDetailKeys = [
  "name",
  "location",
  "description",
  "startDate",
  "endDate",
];

export type EventOverview = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  organiserId: string;
};
