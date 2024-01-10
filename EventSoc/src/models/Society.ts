export interface Society {
  id: string;
  data: SocietyData;
}

export interface SocietyData {
  name: string;
  description: string;
  pictureUrl: string;
  exec: string[];
  eventIds: string[];
}

export const defaultSocietyData: () => SocietyData = () => {
  return {
    name: "",
    description: "",
    pictureUrl: "",
    exec: [],
    eventIds: []
  };
};
