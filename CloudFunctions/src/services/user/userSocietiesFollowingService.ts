import { userSocietiesFollowingColGroup } from "../../firestoreConfig";
import { updateQueryDocs } from "../queryDocsService";

export function updateUsersExecMemberSocietyName(
  societyId: string,
  updatedName: string
) {
  updateQueryDocs(userSocietiesFollowingColGroup.where("id", "==", societyId), {
    name: updatedName
  });
}
