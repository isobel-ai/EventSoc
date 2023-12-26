export interface User {
  name: string;
}

export const defaultUser: () => User = () => {
  return { name: "" };
};

export interface RetrieveUser extends User {
  id: string;
}

export const defaultRetrieveUser: () => RetrieveUser = () =>
  Object.assign(defaultUser(), { id: "" });
