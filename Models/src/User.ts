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
  userId: string;
  name: string;
  notificationTokens: string[];
};

export function defaultUserOverview(): UserOverviewData {
  return { userId: "", name: "", notificationTokens: <string[]>[] };
}
