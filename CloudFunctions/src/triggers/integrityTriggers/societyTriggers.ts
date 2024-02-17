import { logger } from "firebase-functions/v1";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated
} from "firebase-functions/v2/firestore";
import { region } from "../../constants";
import { isUndefined } from "lodash";
import { SocietyData } from "../../../../Shared/models/Society";
import {
  createSocietyName,
  updateSocietyName
} from "../../services/namesService";
import { getUpdates } from "../../helpers/UpdateHelper";
import {
  deleteEventOrganisersExecMember,
  updateEventOrganisersExecMember,
  updateEventOrganisersName
} from "../../services/event/eventsService";
import { UserOverview } from "../../../../Shared/models/User";
import { updateSocietyExecMemberData } from "../../services/society/societyExecService";
import { updateUsersExecMemberSocietyName } from "../../services/user/userExecMemberSocietiesService";

export const societyCreateTrigger = onDocumentCreated(
  { document: "societies/{societyId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const societyData = event.data.data() as SocietyData;

    createSocietyName(event.params.societyId, societyData.name)
      .then(() => logger.info(`societyNames/${event.params.societyId} created`))
      .catch((err) => logger.error(err.message));
  }
);

export const societyUpdateTrigger = onDocumentUpdated(
  { document: "societies/{societyId}", region: region },
  async (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const beforeSociety = event.data.before.data() as SocietyData;
    const afterSociety = event.data.after.data() as SocietyData;

    const updates = getUpdates(beforeSociety, afterSociety);

    if (!isUndefined(updates.name)) {
      updateSocietyName(event.params.societyId, updates.name)
        .then(() =>
          logger.info(`societyNames/${event.params.societyId} updated`)
        )
        .catch((err) => logger.error(err.message));

      const newName = updates.name;
      [
        updateUsersExecMemberSocietyName,
        updateEventOrganisersName,
        updateUsersExecMemberSocietyName
      ].forEach((updateFunc) => updateFunc(event.params.societyId, newName));
    }
  }
);

export const societyExecCreateTrigger = onDocumentCreated(
  { document: "societies/{societyId}/exec/{userId}", region: region },
  async (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    updateSocietyExecMemberData(event.data.ref, event.params.userId)
      .then(() => logger.info(`Updated ${event.document} data`))
      .catch((err) => logger.error(err.message));
  }
);

export const societyExecUpdateTrigger = onDocumentUpdated(
  { document: "societies/{societyId}/exec/{userId}", region: region },
  async (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const beforeExecMember = {
      ...event.data.before.data(),
      id: event.params.userId
    } as UserOverview;
    const afterExecMember = {
      ...event.data.after.data(),
      id: event.params.userId
    } as UserOverview;

    updateEventOrganisersExecMember(
      event.params.societyId,
      beforeExecMember,
      afterExecMember
    );
  }
);

export const societyExecDeleteTrigger = onDocumentDeleted(
  { document: "societies/{societyId}/exec/{userId}", region: region },
  async (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const execMember = {
      ...event.data.data(),
      id: event.params.userId
    } as UserOverview;

    deleteEventOrganisersExecMember(event.params.societyId, execMember);
  }
);
