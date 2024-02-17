import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp();

const db = getFirestore(app);

export const eventsCol = db.collection("events");
export const eventAttendeesCol = (eventId: string) =>
  eventsCol.doc(eventId).collection("attendees");
export const eventAttendeesColGroup = db.collectionGroup("attendees");
export const eventCommentsCol = (eventId: string) =>
  eventsCol.doc(eventId).collection("comments");
export const eventCommentsColGroup = db.collectionGroup("comments");
export const eventCommentRepliesCol = (eventId: string, commentId: string) =>
  eventCommentsCol(eventId).doc(commentId).collection("replies");
export const eventCommentRepliesColGroup = db.collectionGroup("replies");

export const societyExecColGroup = db.collectionGroup("exec");
export const societyEventsColGroup = db.collectionGroup("socEvents");

export const usersCol = db.collection("users");
export const userEventsAttendingColGroup =
  db.collectionGroup("eventsAttending");
export const userExecMemberSocietiesColGroup = db.collectionGroup(
  "execMemberSocieties"
);
export const userSocietiesFollowingColGroup =
  db.collectionGroup("societiesFollowing");

export const userNamesCol = db.collection("userNames");
export const societyNamesCol = db.collection("societyNames");
