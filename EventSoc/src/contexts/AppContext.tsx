import { createContext, useContext } from "react";
import { Event } from "../models/Event";
import { Society } from "../models/Society";
import { User } from "../models/User";

export type AppContent = {
  societies: Society[];
  events: Event[];
  users: User[];

  userId: string;

  updateSocieties: () => Promise<void>;
  updateEvents: () => Promise<void>;
  updateUsers: () => Promise<void>;

  updateSocietyData: (id: string) => Promise<void>;
  updateEventData: (id: string) => Promise<void>;
  updateUserData: (id: string) => Promise<void>;
};

const AppContext = createContext<AppContent>({
  societies: [],
  events: [],
  users: [],

  userId: "",

  updateSocieties: () => Promise.resolve(),
  updateEvents: () => Promise.resolve(),
  updateUsers: () => Promise.resolve(),

  updateSocietyData: () => Promise.resolve(),
  updateEventData: () => Promise.resolve(),
  updateUserData: () => Promise.resolve()
});
export default AppContext;

export const useAppContext = () => useContext(AppContext);
