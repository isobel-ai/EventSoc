export type Society = {
  id: string;
  data: SocietyData;
};

export type SocietyData = {
  name: string;
  description: string;
};

export function defaultSocietyData(): SocietyData {
  return { name: "", description: "" };
}

export type SocietyOverview = {
  id: string;
  name: string;
};

export function defaultSocietyOverview(): SocietyOverview {
  return { id: "", name: "" };
}
