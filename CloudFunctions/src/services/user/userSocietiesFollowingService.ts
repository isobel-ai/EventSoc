import { userSocietiesFollowingColGroup } from "../../firestoreConfig";
import { updateQueryDocs } from "../queryService";

export function updateUsersExecMemberSocietyName(
  societyId: string,
  updatedName: string
) {
  updateQueryDocs(userSocietiesFollowingColGroup.where("id", "==", societyId), {
    name: updatedName
  });
}
