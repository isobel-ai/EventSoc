import {
  addDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  where
} from "firebase/firestore";
import {
  eventCommentRepliesCol,
  eventCommentsCol
} from "../../config/firebaseConfig";
import {
  CommentData,
  defaultCommentData
} from "../../../../Shared/models/CommentOrReply";
import { docToCommentDoc } from "../../mappers/docToComment";
import { retrieveUserOverview } from "../user/usersService";

export async function createComment(
  eventId: string,
  authorId: string,
  contents: string,
  isExecComment: boolean
) {
  const comment: CommentData = {
    ...defaultCommentData(),
    author: await retrieveUserOverview(authorId),
    contents: contents,
    isExecComment: isExecComment
  };
  await addDoc(eventCommentsCol(eventId), comment);
}

export function retrieveComments(eventId: string) {
  return getDocs(
    query(eventCommentsCol(eventId), orderBy("timestamp", "desc"))
  ).then((commentsSnapshot) => commentsSnapshot.docs.map(docToCommentDoc));
}

export function retrieveComment(eventId: string, commentId: string) {
  return getDoc(doc(eventCommentsCol(eventId), commentId)).then(
    docToCommentDoc
  );
}

export function retrieveCommentReplyCount(eventId: string, commentId: string) {
  return getCountFromServer(
    query(
      eventCommentRepliesCol(eventId, commentId),
      where("parentReplyIds", "==", [])
    )
  ).then((result) => result.data().count);
}
