import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { CommentData, CommentDoc } from "../../../Shared/models/CommentOrReply";
import { isUndefined } from "lodash";

export function docToCommentDoc(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  return <CommentDoc>{ id: doc.id, data: docToCommentData(doc) };
}

export function docToCommentData(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Document ${doc.ref.path} does not exist`);
  }

  const commentData = {
    ...data,
    timestamp: data.timestamp.toDate()
  } as CommentData;
  return commentData;
}
