export type UserData = {
  name: string;
  notificationTokens: string[];
  interests: string[];
};

export function defaultUserData(): UserData {
  return { name: "", notificationTokens: [], interests: [] };
}

export type UserOverview = {
  id: string;
  name: string;
  notificationTokens: string[];
};

export function defaultUserOverview(): UserOverview {
  return { id: "", name: "", notificationTokens: <string[]>[] };
}

export type UserInterests = { id: string; interests: string[] };

export type UserRecScore = {
  tagScore: number;
  organiserScore: number;
};
