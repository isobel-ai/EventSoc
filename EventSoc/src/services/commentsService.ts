import { doc, getDoc } from "firebase/firestore";
import { commentsCol } from "../config/firebaseConfig";
import { Comment } from "../models/Comment";

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
