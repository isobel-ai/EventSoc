import { eventUserRecScoresCol } from "../../firestoreConfig";
import * as logger from "firebase-functions/logger";

export function createEventUserRecScore(
  eventId: string,
  userId: string,
  tagScore: number,
  organiserScore: number
) {
  const doc = eventUserRecScoresCol(eventId).doc(userId);
  doc
    .set({ tagScore: tagScore, organiserScore: organiserScore })
    .then(() => logger.info(`Created ${doc.path}`))
    .catch((err) => logger.error(err.message));
}

export function updateEventUserRecTagScore(
  eventId: string,
  userId: string,
  tagScore: number
) {
  const doc = eventUserRecScoresCol(eventId).doc(userId);
  doc
    .update({ tagScore: tagScore })
    .then(() => logger.info(`Updated ${doc.path} tag score`))
    .catch((err) => logger.error(err.message));
}

export function updateEventUserRecOrganiserScore(
  eventId: string,
  userId: string,
  organiserScore: number
) {
  const doc = eventUserRecScoresCol(eventId).doc(userId);
  doc
    .update({ organiserScore: organiserScore })
    .then(() => logger.info(`Updated ${doc.path} organiser score`))
    .catch((err) => logger.error(err.message));
}
