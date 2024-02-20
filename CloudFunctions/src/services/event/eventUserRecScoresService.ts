import { eventUserRecScoresCol } from "../../firestoreConfig";
import * as logger from "firebase-functions/logger";

export function createEventUserRecScore(
  eventId: string,
  userId: string,
  tagScore: number,
  organiserScore: number
) {
  eventUserRecScoresCol(eventId)
    .doc(userId)
    .set({ tagScore: tagScore, organiserScore: organiserScore })
    .catch((err) => logger.error(err.message));
}

export function updateEventUserRecTagScore(
  eventId: string,
  userId: string,
  tagScore: number
) {
  eventUserRecScoresCol(eventId)
    .doc(userId)
    .update({ tagScore: tagScore })
    .catch((err) => logger.error(err.message));
}

export function updateEventUserRecOrganiserScore(
  eventId: string,
  userId: string,
  organiserScore: number
) {
  eventUserRecScoresCol(eventId)
    .doc(userId)
    .update({ organiserScore: organiserScore })
    .catch((err) => logger.error(err.message));
}
