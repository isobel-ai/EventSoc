export type UserData = {
  name: string;
  notificationTokens: string[];
};

export function defaultUserData(): UserData {
  return { name: "", notificationTokens: [] };
}

export type UserOverview = UserOverviewData & {
  id: string;
};

export function defaultUserOverview(): UserOverview {
  return { id: "", name: "", notificationTokens: <string[]>[] };
}

export type UserOverviewData = {
  name: string;
  notificationTokens: string[];
};
