import { UserOverview } from "./User";

export type SocietyData = {
  name: string;
  description: string;
  stripeID: string;
};

export function defaultSocietyData(): SocietyData {
  return { name: "", description: "", stripeID: "" };
}

export type SocietyOverview = {
  id: string;
  name: string;
  stripeID: string;
  exec: UserOverview[];
};

export function defaultSocietyOverview(): SocietyOverview {
  return { id: "", name: "", stripeID: "", exec: <UserOverview[]>[] };
}
