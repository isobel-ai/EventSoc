import { firestore } from "firebase-admin";
import { EventData, EventDoc } from "../../../../Shared/models/Event";
import { UserOverview } from "../../../../Shared/models/User";
import { eventsCol } from "../../firestoreConfig";
import { updateQueryDocs } from "../queryDocsService";

export function retrieveEventData(eventId: string) {
  return eventsCol
    .doc(eventId)
    .get()
    .then((doc) => <EventData>doc.data());
}

export function retrieveUpcomingEvents(): Promise<EventDoc[]> {
  return eventsCol
    .where("endDate", ">", new Date())
    .get()
    .then((eventsSnapshot) =>
      eventsSnapshot.docs.map((doc) => {
        return { id: doc.id, data: <EventData>doc.data() };
      })
    );
}

export function retrieveUpcomingEventIdsByOrganiser(organiserId: string) {
  return eventsCol
    .select()
    .where("endDate", ">", new Date())
    .where("organiser.id", "==", organiserId)
    .get()
    .then((eventsSnapshot) => eventsSnapshot.docs.map((doc) => doc.id));
}

export function updateEventOrganisersName(societyId: string, newName: string) {
  updateQueryDocs(eventsCol.where("organiser.id", "==", societyId), {
    "organiser.name": newName
  });
}

export function updateEventOrganisersExecMember(
  societyId: string,
  beforeExecMember: UserOverview,
  afterExecMember: UserOverview
) {
  updateQueryDocs(eventsCol.where("organiser.id", "==", societyId), {
    "organiser.exec": firestore.FieldValue.arrayRemove(beforeExecMember)
  });
  updateQueryDocs(eventsCol.where("organiser.id", "==", societyId), {
    "organiser.exec": firestore.FieldValue.arrayUnion(afterExecMember)
  });
}

export function deleteEventOrganisersExecMember(
  societyId: string,
  execMember: UserOverview
) {
  updateQueryDocs(eventsCol.where("organiser.id", "==", societyId), {
    "organiser.exec": firestore.FieldValue.arrayRemove(execMember)
  });
}
