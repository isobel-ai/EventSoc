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
  capacity: number; // -1 = unlimited capacity
  attendeeIds: string[];
  commentIds: string[];
}

export const defaultEventData: () => EventData = () => {
  const defaultDate = new Date();
  defaultDate.setSeconds(0, 0);

  return {
    name: "",
    location: "",
    description: "",
    startDate: defaultDate,
    endDate: defaultDate,
    pictureUrl: "",
    tags: <string[]>[],
    organiserId: "",
    capacity: -1,
    attendeeIds: <string[]>[],
    commentIds: <string[]>[],
  };
};
