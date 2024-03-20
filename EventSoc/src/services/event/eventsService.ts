import {
  doc,
  getDocs,
  query,
  orderBy,
  getDoc,
  Transaction,
  where,
  writeBatch,
  increment,
  WriteBatch
} from "firebase/firestore";
import { db, eventPicturesRef, eventsCol } from "../../config/firebaseConfig";
import {
  EventData,
  EventDocAndRecScore
} from "../../../../Shared/models/Event";
import { downloadImage, updateImage, uploadImage } from "../storageService";
import { isUndefined } from "lodash";
import {
  docToEventData,
  docToEventDocAndRecScore,
  docToEventOverviewNarrow
} from "../../mappers/docToEvent";
import { retrieveEventUserRecScore } from "./eventUserRecScoresService";
import {
  deleteSocietyEvent,
  updateSocietyEventName
} from "../society/societyEventsService";
import { deleteEventAttendee } from "./eventAttendeesService";
import { updateUserEventAttendingName } from "../user/userEventsAttendingService";

export async function createEvent(
  event: EventData,
  image: string,
  transaction: Transaction
) {
  const eventRef = doc(eventsCol);
  if (image) {
    await uploadImage(image, eventPicturesRef, eventRef.id);
  }

  transaction.set(eventRef, event);

  return eventRef.id;
}

export function retrieveEventData(eventId: string, transaction?: Transaction) {
  return (
    isUndefined(transaction)
      ? getDoc(doc(eventsCol, eventId))
      : transaction.get(doc(eventsCol, eventId))
  ).then(docToEventData);
}

export function retrieveIsEventFull(eventId: string, transaction: Transaction) {
  return retrieveEventData(eventId, transaction).then(
    (event) => event.capacity >= 0 && event.attendance >= event.capacity
  );
}

export function retrieveEventOverview(
  eventId: string,
  transaction: Transaction
) {
  return transaction
    .get(doc(eventsCol, eventId))
    .then(docToEventOverviewNarrow);
}

export function retrieveUpcomingEventsAndRecScores(
  userId: string
): Promise<EventDocAndRecScore[]> {
  return getDocs(
    query(eventsCol, where("endDate", ">", new Date()), orderBy("endDate"))
  )
    .then((eventsSnapshot) =>
      eventsSnapshot.docs.map(async (eventDoc) => {
        const score = await retrieveEventUserRecScore(
          eventDoc.id,
          userId
        ).catch((err) => {
          console.error(err.message);
          return 0;
        });
        return docToEventDocAndRecScore(eventDoc, score);
      })
    )
    .then((retrievalOperations) => Promise.all(retrievalOperations));
}

export function retrieveEventImage(eventId: string) {
  return downloadImage(eventPicturesRef, eventId);
}

/**
 * @param attendeeId the user's id. If they are not an attendee,
 * nothing in eventAttendees (or userEventsAttending) will be updated
 */
export async function updateEvent(
  eventId: string,
  updates: Partial<EventData>,
  organiserId: string,
  attendeeId: string,
  newImage?: string
) {
  if (!isUndefined(newImage)) {
    await updateImage(eventPicturesRef, eventId, newImage);
  }

  const batch = writeBatch(db);
  batch.update(doc(eventsCol, eventId), updates);

  if (!isUndefined(updates.name)) {
    updateSocietyEventName(organiserId, eventId, updates.name, batch);
    updateUserEventAttendingName(attendeeId, eventId, updates.name, batch);
  }

  await batch.commit();
}

export function incrementEventAttendance(
  eventId: string,
  by: number,
  transOrBatch: Transaction | WriteBatch
) {
  if (transOrBatch instanceof Transaction) {
    transOrBatch.update(doc(eventsCol, eventId), { attendance: increment(by) });
  } else {
    transOrBatch.update(doc(eventsCol, eventId), { attendance: increment(by) });
  }
}

/**
 * @param attendeeId the user's id. If they are not an attendee,
 * nothing will be deleted from eventAttendees (or userEventsAttending)
 */
export async function deleteEvent(
  eventId: string,
  organiserId: string,
  attendeeId: string
) {
  const batch = writeBatch(db);
  batch.delete(doc(eventsCol, eventId));
  deleteSocietyEvent(organiserId, eventId, batch);
  deleteEventAttendee(eventId, attendeeId, batch);
  await batch.commit();
}
