import { logger } from "firebase-functions/v1";
import {
  eventCommentRepliesCol,
  eventCommentRepliesColGroup
} from "../../firestoreConfig";
import { ReplyData } from "../../../../Shared/models/CommentOrReply";
import { UserOverview } from "../../../../Shared/models/User";
import { updateQueryDocs } from "../queryService";

export function retrieveReplyParentNotifTokens(
  eventId: string,
  commentId: string,
  replyParentIds: string[]
) {
  const retrieveOperations = replyParentIds.map((id) =>
    eventCommentRepliesCol(eventId, commentId)
      .doc(id)
      .get()
      .then((doc) => (<ReplyData>doc.data()).author.notificationTokens)
      .catch((err) => logger.error(err.message))
  );

  return Promise.all(retrieveOperations).then((results) =>
    results.flatMap((result) => (result === undefined ? [] : result))
  );
}

export function updateEventCommentReplyAuthors(
  userId: string,
  data: UserOverview
) {
  updateQueryDocs(
    eventCommentRepliesColGroup.where("author.id", "==", userId),
    {
      author: data
    }
  );
}
