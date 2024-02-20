import {
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  getDoc,
  Transaction,
  deleteDoc,
  where
} from "firebase/firestore";
import { eventPicturesRef, eventsCol } from "../../config/firebaseConfig";
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

export function retrieveEventData(eventId: string) {
  return getDoc(doc(eventsCol, eventId)).then(docToEventData);
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

export async function updateEvent(
  eventId: string,
  updates: Partial<EventData>,
  newImage?: string
) {
  if (!isUndefined(newImage)) {
    await updateImage(eventPicturesRef, eventId, newImage);
  }
  await updateDoc(doc(eventsCol, eventId), updates);
}

export async function deleteEvent(eventId: string) {
  await deleteDoc(doc(eventsCol, eventId));
}
