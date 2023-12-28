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

export function createSocEvent(createEvent: CreateEvent, socId: string) {
  return runTransaction(db, (transaction) => {
    const eventRef = doc(eventsCol);

    const { localPictureUrl: localPictureURL, ...event } = createEvent;

    const uploadResult = localPictureURL
      ? uploadImage(eventPicturesRef, localPictureURL, eventRef.id)
      : Promise.resolve("");

    return uploadResult
      .then((result) => {
        if (result instanceof Error) {
          return result;
        }
        transaction.set(eventRef, { ...event, pictureUrl: result });
      })
      .then((createResult) => {
        if (createResult instanceof Error) {
          return createResult;
        }
        transaction.update(doc(societiesCol, socId), {
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
