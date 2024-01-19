import { doc, getDoc } from "firebase/firestore";
import { commentsCol } from "../config/firebaseConfig";
import { Comment } from "../models/Comment";

export function retrieveComments(commentIds: string[]) {
  const commentPromises = commentIds.map((commentId) =>
    getDoc(doc(commentsCol, commentId)).then(
      (commentSnapshot) =>
        <Comment>{ id: commentSnapshot.id, data: commentSnapshot.data() }
    )
  );

  return Promise.all(commentPromises).catch(() => {
    throw Error("Unable to retreive comments. Try again later.");
  });
}
