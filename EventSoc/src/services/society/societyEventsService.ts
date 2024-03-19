import {
  doc,
  getDocs,
  query,
  runTransaction,
  orderBy,
  WriteBatch
} from "firebase/firestore";
import { db, societyEventsCol } from "../../config/firebaseConfig";
import { docToEventOverviewNarrow } from "../../mappers/docToEvent";
import { EventData } from "../../../../Shared/models/Event";
import { retrieveSocietyOverview } from "./societiesService";
import { createEvent } from "../event/eventsService";
import { eventDataToOverview } from "../../mappers/dataToOverview";

export async function createSocietyEvent(
  societyId: string,
  eventWithoutOrganiser: EventData,
  image: string
) {
  return runTransaction(db, async (transaction) => {
    const eventWithOrganiser = {
      ...eventWithoutOrganiser,
      organiser: await retrieveSocietyOverview(societyId, transaction)
    };

    const eventId = await createEvent(eventWithOrganiser, image, transaction);

    transaction.set(
      doc(societyEventsCol(societyId), eventId),
      eventDataToOverview(eventId, eventWithOrganiser)
    );
  });
}

export function retrieveSocietyEvents(societyId: string) {
  return getDocs(
    query(societyEventsCol(societyId), orderBy("startDate", "desc"))
  ).then((eventsSnapshot) => eventsSnapshot.docs.map(docToEventOverviewNarrow));
}

export function updateSocietyEventName(
  societyId: string,
  eventId: string,
  newName: string,
  batch: WriteBatch
) {
  batch.update(doc(societyEventsCol(societyId), eventId), { name: newName });
}

export function deleteSocietyEvent(
  societyId: string,
  eventId: string,
  batch: WriteBatch
) {
  batch.delete(doc(societyEventsCol(societyId), eventId));
}
