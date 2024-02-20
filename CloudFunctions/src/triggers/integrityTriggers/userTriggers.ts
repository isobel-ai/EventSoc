import {
  onDocumentCreated,
  onDocumentUpdated
} from "firebase-functions/v2/firestore";
import { region } from "../../constants";
import * as logger from "firebase-functions/logger";
import { isUndefined, isEmpty } from "lodash";
import { createUserName, updateUserName } from "../../services/namesService";
import { UserData } from "../../../../Shared/models/User";
import { getUpdates } from "../../helpers/UpdateHelper";
import { updateEventAttendees } from "../../services/event/eventAttendeeService";
import {
  userToOverview,
  userToOverviewUpdates
} from "../../narrowMappers/toNarrowUser";
import { updateSocietyExecs } from "../../services/society/societyExecService";
import { updateEventCommentAuthors } from "../../services/event/eventCommentsService";
import { updateEventCommentReplyAuthors } from "../../services/event/eventCommentRepliesService";

export const userCreateTrigger = onDocumentCreated(
  { document: "users/{userId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const userData = event.data.data() as UserData;
    createUserName(event.params.userId, userData.name);
  }
);

export const userUpdateTrigger = onDocumentUpdated(
  { document: "users/{userId}", region: region },
  async (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const beforeUser = event.data.before.data() as UserData;
    const afterUser = event.data.after.data() as UserData;

    const updates = getUpdates(beforeUser, afterUser);
    const overviewUpdates = userToOverviewUpdates(updates);

    !isUndefined(updates.name) &&
      updateUserName(event.params.userId, updates.name);

    if (!isEmpty(overviewUpdates)) {
      [updateEventAttendees, updateSocietyExecs].forEach((updateFunc) =>
        updateFunc(event.params.userId, overviewUpdates)
      );

      const updatedOverview = userToOverview(event.params.userId, afterUser);
      [updateEventCommentAuthors, updateEventCommentReplyAuthors].forEach(
        (updateFunc) => updateFunc(event.params.userId, updatedOverview)
      );
    }
  }
);
