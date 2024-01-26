import { arrayUnion, doc, getDoc, runTransaction } from "firebase/firestore";
import { commentsCol, db } from "../config/firebaseConfig";
import {
  Comment,
  CommentAncestry,
  CommentData,
  defaultCommentData
} from "../../../Models/Comment";

export function retrieveCommentData(id: string) {
  return getDoc(doc(commentsCol, id))
    .then((commentSnapshot) => {
      if (!commentSnapshot.exists()) {
        throw Error;
      }
      return {
        ...commentSnapshot.data(),
        timestamp: commentSnapshot.data().timestamp.toDate()
      } as CommentData;
    })
    .catch(() => {
      throw Error("Could not retrieve comment. Try again later.");
    });
}

export function retrieveComments(commentIds: string[]) {
  const commentPromises = commentIds.map((commentId) =>
    getDoc(doc(commentsCol, commentId)).then((commentSnapshot) => {
      if (!commentSnapshot.exists()) {
        return Error();
      }
      const commentData = {
        ...commentSnapshot.data(),
        timestamp: commentSnapshot.data().timestamp.toDate()
      };
      return <Comment>{ id: commentSnapshot.id, data: commentData };
    })
  );

  return Promise.all(commentPromises)
    .then((commentResults) => {
      const comments = <Comment[]>(
        commentResults.filter((comment) => !(comment instanceof Error))
      );
      if (comments.length === 0 && commentIds.length > 0) {
        throw Error;
      }
      return comments.sort(
        (a, b) => b.data.timestamp.getTime() - a.data.timestamp.getTime()
      );
    })
    .catch(() => {
      throw Error("Unable to retreive comments. Try again later.");
    });
}

export function retrieveReplies(commentId: string) {
  return retrieveCommentData(commentId)
    .then((commentData) => retrieveComments(commentData.replyIds))
    .catch(() => {
      throw Error("Unable to retreive replies. Try again later.");
    });
}

export async function retrieveReplyAncestry(
  replyId: string
): Promise<CommentAncestry> {
  const ancestors: Comment[] = [];

  let parentId = replyId;
  while (parentId !== "") {
    const parentComment = await retrieveCommentData(parentId).catch(() =>
      Error("Unable to retrieve comment ancestor Try again later.")
    );

    if (parentComment instanceof Error) {
      return { ancestry: ancestors, error: parentComment };
    }

    parentId !== replyId && // Don't push reply
      ancestors.push({ id: parentId, data: parentComment });
    parentId = parentComment.parentId;
  }

  return { ancestry: ancestors };
}

export function postReply(
  commentId: string,
  authorId: string,
  contents: string
) {
  return runTransaction(db, (transaction) => {
    const commentDoc = doc(commentsCol, commentId);
    const replyDoc = doc(commentsCol);

    const reply: CommentData = {
      ...defaultCommentData(),
      authorId: authorId,
      contents: contents,
      parentId: commentId
    };

    transaction
      .set(replyDoc, reply)
      .update(commentDoc, { replyIds: arrayUnion(replyDoc.id) });

    return Promise.resolve();
  }).catch(() => {
    throw Error("Unable to post reply. Try again later.");
  });
}
