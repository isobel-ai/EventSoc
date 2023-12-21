export interface User {
  id: string;
  name: string;
}

export const defaultUser: () => User = () => {
  return { id: "", name: "" };
};
