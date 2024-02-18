import { CommentData } from "../../../../Shared/models/CommentOrReply";
import { UserOverview } from "../../../../Shared/models/User";
import { eventCommentsCol, eventCommentsColGroup } from "../../firestoreConfig";
import { updateQueryDocs } from "../queryDocsService";

export function retrieveEventCommentAuthorNotifTokens(
  eventId: string,
  commentId: string
) {
  return eventCommentsCol(eventId)
    .doc(commentId)
    .get()
    .then((doc) => (<CommentData>doc.data()).author.notificationTokens);
}

export async function updateEventCommentAuthors(
  userId: string,
  data: UserOverview
) {
  updateQueryDocs(eventCommentsColGroup.where("author.id", "==", userId), {
    author: data
  });
}
