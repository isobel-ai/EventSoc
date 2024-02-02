import { CommentData } from "../../../Models/Comment";
import { commentsCol } from "../firestoreConfig";

export function getCommentData(commentId: string) {
  return commentsCol
    .doc(commentId)
    .get()
    .then((commentSnapShot) => <CommentData>commentSnapShot.data());
}
