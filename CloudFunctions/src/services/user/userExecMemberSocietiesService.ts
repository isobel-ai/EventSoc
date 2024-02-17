import { userExecMemberSocietiesColGroup } from "../../firestoreConfig";
import { updateQueryDocs } from "../queryService";

export function updateUsersExecMemberSocietyName(
  societyId: string,
  updatedName: string
) {
  updateQueryDocs(
    userExecMemberSocietiesColGroup.where("id", "==", societyId),
    { name: updatedName }
  );
}
