import {
  addDoc,
  arrayUnion,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
  orderBy
} from "firebase/firestore";
import {
  ReplyData,
  ReplyDoc,
  defaultReplyData
} from "../../../../Shared/models/CommentOrReply";
import { db, eventCommentRepliesCol } from "../../config/firebaseConfig";
import { docToReplyDoc } from "../../mappers/docToReply";
import { retrieveUserOverview } from "../user/usersService";

export async function createReplyToComment(
  eventId: string,
  commentId: string,
  authorId: string,
  contents: string,
  isExecComment: boolean
) {
  const reply: ReplyData = {
    ...defaultReplyData(),
    author: await retrieveUserOverview(authorId),
    contents: contents,
    isExecComment: isExecComment
  };
  await addDoc(eventCommentRepliesCol(eventId, commentId), reply);
}

export async function createReplyToReply(
  eventId: string,
  topLevelCommentId: string,
  replyId: string,
  replyParentIds: string[],
  authorId: string,
  contents: string,
  isExecComment: boolean
) {
  const reply: ReplyData = {
    ...defaultReplyData(),
    author: await retrieveUserOverview(authorId),
    contents: contents,
    isExecComment: isExecComment,
    parentReplyIds: [...replyParentIds, replyId]
  };

  const replyDocRef = doc(
    eventCommentRepliesCol(eventId, topLevelCommentId),
    replyId
  );
  const replyReplyDocRef = doc(
    eventCommentRepliesCol(eventId, topLevelCommentId)
  );

  const batch = writeBatch(db);
  batch
    .set(replyReplyDocRef, reply)
    .update(replyDocRef, { replyIds: arrayUnion(replyReplyDocRef.id) });
  await batch.commit();
}

export function retrieveCommentReply(
  eventId: string,
  commentId: string,
  replyId: string
) {
  return getDoc(doc(eventCommentRepliesCol(eventId, commentId), replyId)).then(
    docToReplyDoc
  );
}

export function retrieveCommentReplies(eventId: string, commentId: string) {
  return getDocs(
    query(
      eventCommentRepliesCol(eventId, commentId),
      where("parentReplyIds", "==", []),
      orderBy("timestamp", "desc")
    )
  ).then((repliesSnapshot) => repliesSnapshot.docs.map(docToReplyDoc));
}

export async function retrieveReplyReplies(
  eventId: string,
  topLevelCommentId: string,
  replyReplyIds: string[]
) {
  if (!replyReplyIds.length) {
    return [];
  }

  // Retrievals must be done in batches of 30 due to Firestore limitation on "in" WhereFilterOp
  let retrieveOperations: Promise<ReplyDoc[]>[] = [];
  for (let i = 0; i < replyReplyIds.length; i += 30) {
    const replyIdBatch = replyReplyIds.slice(i, i + 29);
    retrieveOperations.push(
      getDocs(
        query(
          eventCommentRepliesCol(eventId, topLevelCommentId),
          where(documentId(), "in", replyIdBatch)
        )
      ).then((repliesSnapshot) => repliesSnapshot.docs.map(docToReplyDoc))
    );
  }

  return Promise.all(retrieveOperations).then((replyBatches) =>
    replyBatches
      .flat()
      .sort((a, b) => b.data.timestamp.getTime() - a.data.timestamp.getTime())
  );
}

export function retrieveReplyParentReplies(
  eventId: string,
  topLevelCommentId: string,
  parentReplyIds: string[]
) {
  const retrieveOperations = parentReplyIds.map((replyId) =>
    getDoc(doc(eventCommentRepliesCol(eventId, topLevelCommentId), replyId))
      .then(docToReplyDoc)
      .catch((err) => {
        console.error(err.message);
        return Error(err);
      })
  );

  return Promise.all(retrieveOperations);
}
