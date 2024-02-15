import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { isUndefined } from "lodash";
import { UserOverview } from "../../../Shared/models/User";

export function docToUserOverviewNarrow(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Document ${doc.ref.path} does not exist`);
  }

  const userOverview: UserOverview = {
    id: doc.id,
    name: data.name,
    notificationTokens: data.notificationTokens
  };

  return userOverview;
}
