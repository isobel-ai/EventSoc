import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { isUndefined } from "lodash";

/** Model can't have properties of type Date
 *
 *  Don't use for narrowing casts
 */
export function docToModel<Model>(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Document ${doc.ref.path} does not exist`);
  }

  return data as Model;
}
