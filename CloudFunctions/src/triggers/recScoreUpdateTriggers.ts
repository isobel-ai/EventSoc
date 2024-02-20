import * as logger from "firebase-functions/logger";
import { region } from "../constants";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated
} from "firebase-functions/v2/firestore";
import { isUndefined, isEqual } from "lodash";
import { EventData } from "../../../Shared/models/Event";
import { retrieveUsersInterests } from "../services/user/usersService";
import { retrieveSocietyScoreForUser } from "../services/user/userSocietiesFollowingService";
import {
  createEventUserRecScore,
  updateEventUserRecOrganiserScore,
  updateEventUserRecTagScore
} from "../services/event/eventUserRecScoresService";
import { calculateAvgTagInterestScore } from "../services/recService";
import { UserData } from "../../../Shared/models/User";
import {
  retrieveUpcomingEventIdsByOrganiser,
  retrieveUpcomingEvents
} from "../services/event/eventsService";

export const eventCreateTrigger = onDocumentCreated(
  { document: "events/{eventId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const eventData = <EventData>event.data.data();

    retrieveUsersInterests()
      .then((users) =>
        users.forEach(async (user) => {
          const tagScore = await calculateAvgTagInterestScore(
            eventData.tags,
            user.interests
          );

          const organiserScore = await retrieveSocietyScoreForUser(
            user.id,
            eventData.organiser.id
          );

          createEventUserRecScore(
            event.params.eventId,
            user.id,
            tagScore,
            organiserScore
          );
        })
      )
      .catch((err) => logger.error(err.message));
  }
);

export const eventUpdateTrigger = onDocumentUpdated(
  { document: "events/{eventId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const beforeEventData = <EventData>event.data.before.data();
    const afterEventData = <EventData>event.data.after.data();

    if (isEqual(beforeEventData.tags, afterEventData.tags)) {
      return;
    }

    retrieveUsersInterests()
      .then((users) =>
        users.forEach(async (user) => {
          const tagScore = await calculateAvgTagInterestScore(
            afterEventData.tags,
            user.interests
          );

          updateEventUserRecTagScore(event.params.eventId, user.id, tagScore);
        })
      )
      .catch((err) => logger.error(err.message));
  }
);

export const userCreateTrigger = onDocumentCreated(
  { document: "users/{userId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const userData = <UserData>event.data.data();

    retrieveUpcomingEvents()
      .then((socEvents) =>
        socEvents.forEach(async (socEvent) => {
          const tagScore = await calculateAvgTagInterestScore(
            socEvent.data.tags,
            userData.interests
          );

          const organiserScore = await retrieveSocietyScoreForUser(
            socEvent.id,
            socEvent.data.organiser.id
          );

          createEventUserRecScore(
            socEvent.id,
            event.params.userId,
            tagScore,
            organiserScore
          );
        })
      )
      .catch((err) => logger.error(err.message));
  }
);

export const userUpdateTrigger = onDocumentUpdated(
  { document: "users/{userId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    const beforeUserData = <UserData>event.data.before.data();
    const afterUserData = <UserData>event.data.after.data();

    if (isEqual(beforeUserData.interests, afterUserData.interests)) {
      return;
    }

    retrieveUpcomingEvents()
      .then((socEvents) =>
        socEvents.forEach(async (socEvent) => {
          const tagScore = await calculateAvgTagInterestScore(
            socEvent.data.tags,
            afterUserData.interests
          );

          updateEventUserRecTagScore(
            socEvent.id,
            event.params.userId,
            tagScore
          );
        })
      )
      .catch((err) => logger.error(err.message));
  }
);

export const userFollowSocietyTrigger = onDocumentCreated(
  { document: "users/{userId}/societiesFollowing/{societyId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    retrieveUpcomingEventIdsByOrganiser(event.params.societyId)
      .then((eventIds) =>
        eventIds.forEach((eventId) =>
          updateEventUserRecOrganiserScore(eventId, event.params.userId, 1)
        )
      )
      .catch((err) => logger.error(err.message));
  }
);

export const userUnfollowSocietyTrigger = onDocumentDeleted(
  { document: "users/{userId}/societiesFollowing/{societyId}", region: region },
  (event) => {
    if (isUndefined(event.data)) {
      logger.error(`Couldn't retrieve data from ${event.document}`);
      return;
    }

    retrieveUpcomingEventIdsByOrganiser(event.params.societyId)
      .then((eventIds) =>
        eventIds.forEach((eventId) =>
          updateEventUserRecOrganiserScore(eventId, event.params.userId, 0)
        )
      )
      .catch((err) => logger.error(err.message));
  }
);
