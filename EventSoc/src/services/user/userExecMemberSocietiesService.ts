import { getDocs } from "firebase/firestore";
import { userExecMemberSocieties } from "../../config/firebaseConfig";
import { docToModel } from "../../mappers/docToModel";
import { Name } from "../../../../Shared/models/Name";

export function retrieveUserExecMemberSocieties(userId: string) {
  return getDocs(userExecMemberSocieties(userId)).then((societiesSnapshot) =>
    societiesSnapshot.docs.map(docToModel<Name>)
  );
}
