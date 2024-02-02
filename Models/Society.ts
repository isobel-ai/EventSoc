export interface Society {
  id: string;
  data: SocietyData;
}

export interface SocietyData {
  name: string;
  description: string;
  pictureUrl: string;
  execIds: string[];
  eventIds: string[];
}

export const defaultSocietyData: () => SocietyData = () => {
  return {
    name: "",
    description: "",
    pictureUrl: "",
    execIds: [],
    eventIds: []
  };
};
