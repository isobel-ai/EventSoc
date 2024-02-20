import * as logger from "firebase-functions/logger";
import {
  onDocumentDeleted,
  onDocumentUpdated
} from "firebase-functions/v2/firestore";
import { EventData } from "../../../../Shared/models/Event";
import { getUpdates } from "../../helpers/UpdateHelper";
import { eventToOverviewUpdates } from "../../narrowMappers/toNarrowEvent";
import { region } from "../../constants";
import { isUndefined, isEmpty } from "lodash";
import {
  deleteUserEventsAttending,
  updateUserEventsAttending
} from "../../services/user/userEventsAttendingService";
import {
  deleteSocietyEvents,
  updateSocietyEvents
} from "../../services/society/societyEventsService";

export const eventUpdateTrigger = onDocumentUpdated(
  { document: "events/{eventId}", region: region },
  async (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const beforeEvent = event.data.before.data() as EventData;
    const afterEvent = event.data.after.data() as EventData;

    const updates = getUpdates(beforeEvent, afterEvent);
    const overviewUpdates = eventToOverviewUpdates(updates);

    if (!isEmpty(overviewUpdates)) {
      [updateUserEventsAttending, updateSocietyEvents].forEach((updateFunc) =>
        updateFunc(event.params.eventId, overviewUpdates)
      );
    }
  }
);

export const eventDeleteTrigger = onDocumentDeleted(
  { document: "events/{eventId}", region: region },
  async (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    [deleteUserEventsAttending, deleteSocietyEvents].forEach((updateFunc) =>
      updateFunc(event.params.eventId)
    );
  }
);
