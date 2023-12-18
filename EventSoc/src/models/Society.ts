import { DocumentReference } from "firebase/firestore";

interface Society {
  name: string;
  description: string;
  pictureUrl: string;
  exec: string[];
  eventRefs: DocumentReference[];
}

const defaultSociety: Society = {
  name: "",
  description: "",
  pictureUrl: "",
  exec: [],
  eventRefs: []
};

export interface RetrieveSociety extends Society {
  id: string;
}

export const defaultRetrieveSociety = Object.assign(defaultSociety, { id: "" });
