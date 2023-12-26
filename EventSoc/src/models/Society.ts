import { DocumentReference } from "firebase/firestore";

export interface Society {
  name: string;
  description: string;
  pictureUrl: string;
  exec: string[];
  eventRefs: DocumentReference[];
}

export const defaultSociety: () => Society = () => {
  return {
    name: "",
    description: "",
    pictureUrl: "",
    exec: [],
    eventRefs: []
  };
};

export interface RetrieveSociety extends Society {
  id: string;
}

export const defaultRetrieveSociety: () => RetrieveSociety = () =>
  Object.assign(defaultSociety(), { id: "" });

export interface CreateSociety extends Society {
  localPictureUrl: string;
}

export const defaultCreateSociety: () => CreateSociety = () =>
  Object.assign(defaultSociety(), { localPictureUrl: "" });

export interface UpdateSociety extends Partial<CreateSociety> {
  id: string;
}
