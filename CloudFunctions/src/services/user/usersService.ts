import { usersCol } from "../../firestoreConfig";
import { docToUserOverview } from "../../narrowMappers/toNarrowUser";

export function retrieveUserOverview(userId: string) {
  return usersCol.doc(userId).get().then(docToUserOverview);
}
