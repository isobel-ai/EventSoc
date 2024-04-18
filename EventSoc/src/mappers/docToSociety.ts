import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { isUndefined } from "lodash";
import { SocietyOverview } from "../../../Shared/models/Society";
import { UserOverview } from "../../../Shared/models/User";

export function docToSocietyOverviewNarrow(
  doc: DocumentSnapshot<DocumentData, DocumentData>,
  exec: UserOverview[]
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Document ${doc.ref.path} does not exist`);
  }

  const societyOverview: SocietyOverview = {
    id: doc.id,
    name: data.name,
    stripeID: data.stripeID,
    exec: exec
  };

  return societyOverview;
}
