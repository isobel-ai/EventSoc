import * as logger from "firebase-functions/logger";
import {
  onDocumentDeleted,
  onDocumentUpdated
} from "firebase-functions/v2/firestore";
import { EventData, eventDetailKeys } from "../../Models/Event";
import { isEqual } from "lodash";
import {
  getNotificationTokens,
  getUserName
} from "./firestoreServices/usersService";
import { sendNotifications } from "./pushNotificationService";
import { region } from "./constants";
import { getExec } from "./firestoreServices/societiesService";
import { getCommentData } from "./firestoreServices/commentsService";

export const eventUpdateNotification = onDocumentUpdated(
  { document: "events/{eventId}", region: region },
  (event) => {
    if (!event.data) {
      logger.error(
        `Couldn't retrieve data from events/${event.params.eventId}`
      );
      return;
    }

    const beforeEvent = <EventData>event.data.before.data();
    const afterEvent = <EventData>event.data.after.data();

    const eventDetailChanged = eventDetailKeys.some(
      (key) =>
        !isEqual(
          beforeEvent[key as keyof EventData],
          afterEvent[key as keyof EventData]
        )
    );
    if (!eventDetailChanged) {
      return;
    }

    getNotificationTokens(afterEvent.attendeeIds)
      .then((notifTokens) =>
        sendNotifications(notifTokens, `${afterEvent.name} has been updated`, {
          type: "EVENT",
          eventId: event.params.eventId
        })
      )
      .then(() =>
        logger.info(
          `Notifications sent for events/${event.params.eventId} detail update`
        )
      )
      .catch((err) => logger.error(err));
  }
);

export const eventDeleteNotification = onDocumentDeleted(
  { document: "events/{eventId}", region: region },
  (event) => {
    if (!event.data) {
      logger.error(
        `Couldn't retrieve data from events/${event.params.eventId}`
      );
      return;
    }

    getNotificationTokens(event.data.data().attendeeIds)
      .then((notifTokens) =>
        sendNotifications(
          notifTokens,
          `${event.data?.data().name} has been cancelled`,
          { type: "DELETE EVENT" }
        )
      )
      .then(() =>
        logger.info(
          `Notifications sent for events/${event.params.eventId} deletion`
        )
      )
      .catch((err) => logger.error(err));
  }
);

export const commentCreateNotification = onDocumentUpdated(
  { document: "events/{eventId}", region: region },
  async (event) => {
    if (!event.data) {
      logger.error(
        `Couldn't retrieve data from events/${event.params.eventId}`
      );
      return;
    }

    const beforeEvent = <EventData>event.data.before.data();
    const afterEvent = <EventData>event.data.after.data();

    const newCommentId = afterEvent.commentIds.find(
      (commentId) => !beforeEvent.commentIds.includes(commentId)
    );
    if (!newCommentId) {
      return;
    }

    let notificationBody = `New comment on ${afterEvent.name}`;

    const newComment = await getCommentData(newCommentId).catch((err) =>
      logger.error(err)
    );
    if (newComment) {
      const newCommentAuthorName = await getUserName(newComment.authorId).catch(
        (err) => logger.error(err)
      );
      if (newCommentAuthorName) {
        notificationBody = `${newCommentAuthorName} commented on ${afterEvent.name}`;
      }

      notificationBody += `:\n${newComment.contents}`;
    }

    getExec(afterEvent.organiserId)
      .then((execIds) =>
        newComment
          ? execIds.filter((execId) => execId !== newComment.authorId)
          : execIds
      )
      .then((execIds) => getNotificationTokens(execIds))
      .then((notifTokens) =>
        sendNotifications(notifTokens, notificationBody, {
          type: "EVENT",
          eventId: event.params.eventId
        })
      )
      .then(() =>
        logger.info(
          `Notifications sent for events/${event.params.eventId} comment creation`
        )
      );
  }
);
