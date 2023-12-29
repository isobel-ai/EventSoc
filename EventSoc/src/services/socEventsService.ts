import {
  doc,
  arrayUnion,
  runTransaction,
  arrayRemove
} from "firebase/firestore";
import {
  eventsCol,
  eventPicturesRef,
  societiesCol,
  db
} from "../config/firebaseConfig";
import { CreateEvent } from "../models/Event";
import { deleteImage, uploadImage } from "./cloudService";
import { retrieveEventOrganiserRef } from "./eventsService";

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

export function deleteSocEvent(eventId: string, pictureUrl: string) {
  return runTransaction(db, (transaction) => {
    const eventDoc = doc(eventsCol, eventId);

    return retrieveEventOrganiserRef(eventDoc)
      .then((retrieveResult) => {
        if (retrieveResult instanceof Error) {
          throw Error;
        }
        return retrieveResult;
      })
      .then((eventOrganiserRef) => {
        transaction.update(eventOrganiserRef, {
          eventRefs: arrayRemove(eventDoc)
        });
        transaction.delete(eventDoc);
      })
      .then(() => pictureUrl && deleteImage(eventPicturesRef, eventId))
      .catch(() => Error("Unable to delete event. Try again later."));
  });
}
