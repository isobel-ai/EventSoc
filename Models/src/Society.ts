import { UserOverviewData } from "./User";

export type SocietyDoc = {
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

export type SocietyOverviewData = {
  societyId: string;
  name: string;
  exec: UserOverviewData[];
};

export function defaultSocietyOverviewData(): SocietyOverviewData {
  return { societyId: "", name: "", exec: <UserOverviewData[]>[] };
}
