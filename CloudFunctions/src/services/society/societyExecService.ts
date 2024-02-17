import { UserOverview } from "../../../../Shared/models/User";
import { societyExecColGroup } from "../../firestoreConfig";
import { updateQueryDocs } from "../queryService";
import { retrieveUserOverview } from "../user/usersService";
import { DocumentReference, DocumentData } from "firebase-admin/firestore";

export async function updateSocietyExecMemberData(
  execMemberDoc: DocumentReference<DocumentData, DocumentData>,
  userId: string
) {
  await retrieveUserOverview(userId).then((data) => execMemberDoc.set(data));
}

export function updateSocietyExecs(
  userId: string,
  data: Partial<UserOverview>
) {
  updateQueryDocs(societyExecColGroup.where("id", "==", userId), data);
}
