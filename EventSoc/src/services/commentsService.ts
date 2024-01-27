import { arrayUnion, doc, getDoc, runTransaction } from "firebase/firestore";
import { commentsCol, db } from "../config/firebaseConfig";
import { Comment, CommentData, defaultCommentData } from "../models/Comment";

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

export function retrieveComments(commentIds: string[], isReplies?: boolean) {
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
      throw Error(
        `Unable to retreive ${
          isReplies ? "replies" : "comments"
        }. Try again later.`
      );
    });
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
