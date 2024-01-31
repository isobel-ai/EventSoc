import * as logger from "firebase-functions/logger";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { EventData, eventDetailKeys } from "../../Models/Event";
import { isEqual } from "lodash";
import { getNotificationTokens } from "./firestoreServices/usersService";
import { sendNotifications } from "./pushNotificationService";
import { region } from "./constants";

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
        sendNotifications(
          notifTokens,
          "Event Update",
          `${afterEvent.name} has been updated`,
          { type: "EVENT", eventId: event.params.eventId }
        )
      )
      .then(() =>
        logger.info(
          `Notifications sent for events/${event.params.eventId} detail update`
        )
      );
  }
);
