import { createContext, useContext } from "react";
import { Event } from "../models/Event";
import { Society } from "../models/Society";
import { User } from "../models/User";

export type AppContent = {
  societies: Society[];
  events: Event[];
  users: User[];

  updateSocieties: () => Promise<undefined | Error>;
  updateEvents: () => Promise<undefined | Error>;
  updateUsers: () => Promise<undefined | Error>;

  updateSocietyInContext: (id: string) => Promise<undefined | Error>;

  getUser: () => User | undefined;
};

const AppContext = createContext<AppContent>({
  societies: [],
  events: [],
  users: [],

  updateSocieties: () => Promise.resolve(undefined),
  updateEvents: () => Promise.resolve(undefined),
  updateUsers: () => Promise.resolve(undefined),

  updateSocietyInContext: () => Promise.resolve(undefined),

  getUser: () => undefined
});
export default AppContext;

export const useAppContext = () => useContext(AppContext);
