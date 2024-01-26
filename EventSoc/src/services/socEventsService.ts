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
import { EventData } from "../../../Models/Event";
import { deleteImage, uploadImage } from "./cloudService";

export function createSocEvent(event: EventData, socId: string) {
  return runTransaction(db, (transaction) => {
    const eventRef = doc(eventsCol);
    const socRef = doc(societiesCol, socId);

    const uploadResult = event.pictureUrl
      ? uploadImage(eventPicturesRef, event.pictureUrl, eventRef.id)
      : Promise.resolve("");

    return uploadResult.then((downloadUrl) => {
      transaction
        .set(eventRef, {
          ...event,
          pictureUrl: downloadUrl,
          organiserId: socId
        })
        .update(socRef, {
          eventIds: arrayUnion(eventRef.id)
        });
    });
  }).catch(() => {
    throw Error("Event couldn't be created. Try again later.");
  });
}

export function deleteSocEvent(
  eventId: string,
  pictureUrl: string,
  organiserId: string
) {
  return runTransaction(db, (transaction) => {
    const eventDoc = doc(eventsCol, eventId);
    const organiserDoc = doc(societiesCol, organiserId);

    transaction
      .update(organiserDoc, {
        eventRefs: arrayRemove(eventDoc)
      })
      .delete(eventDoc);

    return pictureUrl
      ? deleteImage(eventPicturesRef, eventId)
      : Promise.resolve();
  }).catch(() => {
    throw Error("Unable to delete event. Try again later.");
  });
}
