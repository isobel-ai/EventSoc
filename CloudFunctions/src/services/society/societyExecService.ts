import { UserOverview } from "../../../../Shared/models/User";
import { societyExecColGroup } from "../../firestoreConfig";
import { updateQueryDocs } from "../queryDocsService";
import { retrieveUserOverview } from "../user/usersService";
import { DocumentReference, DocumentData } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

export function updateSocietyExecMemberData(
  execMemberDoc: DocumentReference<DocumentData, DocumentData>,
  userId: string
) {
  retrieveUserOverview(userId)
    .then((data) => execMemberDoc.set(data))
    .then(() => logger.info(`Filled in ${execMemberDoc.path} data`))
    .catch((err) => logger.error(err.message));
}

export function updateSocietyExecs(
  userId: string,
  data: Partial<UserOverview>
) {
  updateQueryDocs(societyExecColGroup.where("id", "==", userId), data);
}
