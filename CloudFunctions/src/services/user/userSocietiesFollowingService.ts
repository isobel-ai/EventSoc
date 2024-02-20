import { FieldPath } from "firebase-admin/firestore";
import {
  userSocietiesFollowingCol,
  userSocietiesFollowingColGroup
} from "../../firestoreConfig";
import { updateQueryDocs } from "../queryDocsService";
import * as logger from "firebase-functions/logger";

/**
 * @return 1 if the user follows the society, 0 otherwise
 */
export function retrieveSocietyScoreForUser(userId: string, societyId: string) {
  return userSocietiesFollowingCol(userId)
    .where(FieldPath.documentId(), "==", societyId)
    .limit(1)
    .count()
    .get()
    .then((result) => result.data().count)
    .catch((err) => {
      logger.error(err.message);
      return 0;
    });
}

export function updateUsersExecMemberSocietyName(
  societyId: string,
  updatedName: string
) {
  updateQueryDocs(userSocietiesFollowingColGroup.where("id", "==", societyId), {
    name: updatedName
  });
}
