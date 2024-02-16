import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { ReplyData, ReplyDoc } from "../../../Shared/models/CommentOrReply";
import { isUndefined } from "lodash";

export function docToReplyDoc(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  return <ReplyDoc>{ id: doc.id, data: docToReplyData(doc) };
}

export function docToReplyData(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Document ${doc.ref.path} does not exist`);
  }

  const replyData = {
    ...data,
    timestamp: data.timestamp.toDate()
  } as ReplyData;
  return replyData;
}
