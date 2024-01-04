import { RetrieveEvent, defaultRetrieveEvent } from "./Event";
import { RetrieveSociety, defaultRetrieveSociety } from "./Society";

export interface RetrieveSocEvent {
  society: RetrieveSociety;
  event: RetrieveEvent;
}

export const defaultRetrieveSocEvent = (): RetrieveSocEvent => {
  return { society: defaultRetrieveSociety(), event: defaultRetrieveEvent() };
};
