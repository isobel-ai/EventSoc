import { createContext, useContext } from "react";
import { Event } from "../models/Event";
import { Society } from "../models/Society";
import { User } from "../models/User";

export type AppContent = {
  societies: Society[];
  events: Event[];
  users: User[];

  updateSocieties: () => Promise<void>;
  updateEvents: () => Promise<void>;
  updateUsers: () => Promise<void>;

  updateSocietyInContext: (id: string) => Promise<void>;

  getUser: () => User | undefined;
};

const AppContext = createContext<AppContent>({
  societies: [],
  events: [],
  users: [],

  updateSocieties: () => Promise.resolve(),
  updateEvents: () => Promise.resolve(),
  updateUsers: () => Promise.resolve(),

  updateSocietyInContext: () => Promise.resolve(undefined),

  getUser: () => undefined
});
export default AppContext;

export const useAppContext = () => useContext(AppContext);
