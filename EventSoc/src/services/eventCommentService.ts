import { arrayUnion, doc, runTransaction } from "firebase/firestore";
import { commentsCol, db, eventsCol } from "../config/firebaseConfig";
import { CommentData, defaultCommentData } from "../../../Models/Comment";

export function postComment(
  eventId: string,
  authorId: string,
  contents: string
) {
  return runTransaction(db, (transaction) => {
    const commentDoc = doc(commentsCol);
    const eventDoc = doc(eventsCol, eventId);

    const comment: CommentData = {
      ...defaultCommentData(),
      authorId: authorId,
      contents: contents
    };

    transaction
      .set(commentDoc, comment)
      .update(eventDoc, { commentIds: arrayUnion(commentDoc.id) });

    return Promise.resolve();
  }).catch(() => {
    throw Error("Unable to post comment. Try again later.");
  });
}
