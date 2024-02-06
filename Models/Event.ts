import { SocietyOverview, defaultSocietyOverviewData } from "./Society";

export type EventDoc = {
  id: string;
  data: EventData;
};

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
};

export function defaultEventData(): EventData {
  const defaultDate = new Date();
  defaultDate.setSeconds(0, 0);

  return {
    name: "",
    location: "",
    description: "",
    startDate: defaultDate,
    endDate: defaultDate,
    tags: <string[]>[],
    organiser: defaultSocietyOverviewData(),
    capacity: -1,
  };
}

export const eventDetailKeys = [
  "name",
  "location",
  "description",
  "startDate",
  "endDate",
];

export type EventOverviewData = {
  name: string;
  startDate: Date;
  endDate: Date;
};
