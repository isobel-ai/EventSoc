import {
  doc,
  arrayUnion,
  runTransaction,
  arrayRemove,
  query,
  getDocs,
  orderBy,
  where
} from "firebase/firestore";
import {
  eventsCol,
  eventPicturesRef,
  societiesCol,
  db
} from "../config/firebaseConfig";
import { CreateEvent, RetrieveEvent } from "../models/Event";
import { deleteImage, uploadImage } from "./cloudService";
import { retrieveSociety } from "./societiesService";
import { RetrieveSocEvent } from "../models/SocEvent";

export function retrieveSocEvents() {
  return getDocs(
    query(
      eventsCol,
      where("endDate", ">=", new Date()),
      orderBy("endDate"), // Firebase requires first ordering to use same field as filter
      orderBy("startDate")
    )
  )
    .then((eventsSnapshot) => {
      const socEventPromises = eventsSnapshot.docs.map(async (event) => {
        const retrieveEvent = {
          ...event.data(),
          startDate: event.data().startDate.toDate(),
          endDate: event.data().endDate.toDate(),
          id: event.id
        } as RetrieveEvent;

        const retrieveSocietyAttempt = await retrieveSociety(
          retrieveEvent.organiserRef
        );

        if (retrieveSocietyAttempt instanceof Error) {
          return retrieveSocietyAttempt;
        }
        return {
          event: retrieveEvent,
          society: retrieveSocietyAttempt
        } as RetrieveSocEvent;
      });

      return Promise.all(socEventPromises).then((socEvents) => {
        const resolvedSocEvents = socEvents.filter(
          (socEvent) => !(socEvent instanceof Error)
        ) as RetrieveSocEvent[];
        if (resolvedSocEvents.length == 0 && socEventPromises.length > 0) {
          throw Error;
        }
        return resolvedSocEvents;
      });
    })
    .catch(() => Error("Could not retrieve society events. Try again later."));
}

export function createSocEvent(createEvent: CreateEvent, socId: string) {
  return runTransaction(db, (transaction) => {
    const eventRef = doc(eventsCol);
    const socRef = doc(societiesCol, socId);

    const { localPictureUrl: localPictureURL, ...event } = createEvent;

    const uploadResult = localPictureURL
      ? uploadImage(eventPicturesRef, localPictureURL, eventRef.id)
      : Promise.resolve("");

    return uploadResult
      .then((result) => {
        if (result instanceof Error) {
          return result;
        }
        transaction.set(eventRef, {
          ...event,
          pictureUrl: result,
          organiserRef: socRef
        });
      })
      .then((createResult) => {
        if (createResult instanceof Error) {
          return createResult;
        }
        transaction.update(socRef, {
          eventRefs: arrayUnion(eventRef)
        });
      })
      .catch(() => Error("Event couldn't be created. Try again later."));
  });
}

export function deleteSocEvent(
  eventId: string,
  pictureUrl: string,
  socId: string
) {
  return runTransaction(db, (transaction) => {
    const eventDoc = doc(eventsCol, eventId);

    const deleteImageResult = pictureUrl
      ? deleteImage(eventPicturesRef, eventId)
      : Promise.resolve("");

    return deleteImageResult
      .then((result) => {
        if (result instanceof Error) {
          return result;
        }
        transaction.delete(eventDoc);
      })
      .then((deleteResult) => {
        if (deleteResult instanceof Error) {
          return deleteResult;
        }
        transaction.update(doc(societiesCol, socId), {
          eventRefs: arrayRemove(doc(eventsCol, eventId))
        });
      })
      .catch(() => Error("Unable to delete event. Try again later."));
  });
}
