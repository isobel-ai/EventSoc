import { UserOverview } from "./User";

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
  exec: UserOverview[];
};

export function defaultSocietyOverviewData(): SocietyOverview {
  return { id: "", name: "", exec: <UserOverview[]>[] };
}
