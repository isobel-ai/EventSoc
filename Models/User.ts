export type UserDoc = {
  id: string;
  data: UserData;
};

export type UserData = {
  name: string;
  notificationTokens: string[];
};

export function defaultUserData(): UserData {
  return { name: "", notificationTokens: [] };
}

export type UserOverviewData = {
  name: string;
  notificationTokens: string[];
};

export type UserOverview = {
  id: string;
  name: string;
  notificationTokens: string[];
};

export function defaultUserOverview(): UserOverview {
  return { id: "", name: "", notificationTokens: <string[]>[] };
}
