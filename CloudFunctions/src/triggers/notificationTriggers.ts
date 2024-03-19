import * as logger from "firebase-functions/logger";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated
} from "firebase-functions/v2/firestore";
import { EventData } from "../../../Shared/models/Event";
import { isUndefined } from "lodash";
import { sendNotifications } from "../services/expoNotificationService";
import { region } from "../constants";
import { haveEventDetailsBeenUpdated } from "../helpers/UpdateHelper";
import { retrieveEventAttendeeNotifTokens } from "../services/event/eventAttendeeService";
import { retrieveEventData } from "../services/event/eventsService";
import { CommentData, ReplyData } from "../../../Shared/models/CommentOrReply";
import { retrieveEventCommentAuthorNotifTokens } from "../services/event/eventCommentsService";
import { retrieveReplyParentNotifTokens } from "../services/event/eventCommentRepliesService";

export const eventUpdateNotification = onDocumentUpdated(
  { document: "events/{eventId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const beforeEvent = <EventData>event.data.before.data();
    const afterEvent = <EventData>event.data.after.data();

    if (!haveEventDetailsBeenUpdated(beforeEvent, afterEvent)) {
      return;
    }

    retrieveEventAttendeeNotifTokens(event.params.eventId)
      .then((notifTokens) =>
        sendNotifications(notifTokens, `${afterEvent.name} has been updated`, {
          type: "EVENT",
          eventId: event.params.eventId
        })
      )
      .then(() =>
        logger.info(`Notifications sent for ${event.document} detail update`)
      )
      .catch((err) => logger.error(err.message));
  }
);

export const eventDeleteNotification = onDocumentDeleted(
  { document: "events/{eventId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const eventData = event.data.data() as EventData;

    retrieveEventAttendeeNotifTokens(event.params.eventId)
      .then((notifTokens) =>
        sendNotifications(notifTokens, `${eventData.name} has been cancelled`, {
          type: "DELETE EVENT"
        })
      )
      .then(() =>
        logger.info(`Notifications sent for ${event.document} deletion`)
      )
      .catch((err) => logger.error(err.message));
  }
);

export const commentCreateNotification = onDocumentCreated(
  { document: "events/{eventId}/comments/{commentId}", region: region },
  async (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    try {
      const eventCommentedOn = await retrieveEventData(event.params.eventId);
      const commentData = event.data.data() as CommentData;

      const notificationBody =
        `${commentData.author.name} commented on ${eventCommentedOn.name}:` +
        `\n${commentData.contents}`;

      const notifTokens = eventCommentedOn.organiser.exec.flatMap((member) =>
        // Don't send notification to comment author
        member.id === commentData.author.id ? [] : member.notificationTokens
      );

      await sendNotifications(notifTokens, notificationBody, {
        type: "EVENT",
        eventId: event.params.eventId
      }).then(() =>
        logger.info(`Notifications sent for ${event.document} comment creation`)
      );
    } catch (err: any) {
      logger.error(err.message);
    }
  }
);

export const replyCreateNotification = onDocumentCreated(
  {
    document: "events/{eventId}/comments/{commentId}/replies/{replyId}",
    region: region
  },
  async (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    try {
      const replyData = event.data.data() as ReplyData;

      const notificationBody =
        `${replyData.author.name} replied to your comment:` +
        `\n${replyData.contents}`;

      let notifTokens = [
        ...(await retrieveEventCommentAuthorNotifTokens(
          event.params.eventId,
          event.params.commentId
        )),
        ...(await retrieveReplyParentNotifTokens(
          event.params.eventId,
          event.params.commentId,
          replyData.parentReplyIds
        ))
      ];
      notifTokens = notifTokens.filter(
        (token, index) =>
          // Don't send notification to reply author
          !replyData.author.notificationTokens.includes(token) &&
          // Remove duplicate tokens
          index === notifTokens.indexOf(token)
      );

      await sendNotifications(notifTokens, notificationBody, {
        type: "REPLY",
        topLevelCommentId: replyData.parentReplyIds.length
          ? event.params.commentId
          : undefined,
        eventId: event.params.eventId,
        replyParentId: replyData.parentReplyIds.at(-1) ?? event.params.commentId
      }).then(() =>
        logger.info(`Notifications sent for ${event.document} reply creation`)
      );
    } catch (err: any) {
      logger.error(err.message);
    }
  }
);
