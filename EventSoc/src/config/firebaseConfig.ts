import {
  FirebaseApp,
  FirebaseOptions,
  getApp,
  getApps,
  initializeApp
} from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth
} from "firebase/auth";
import {
  Firestore,
  collection,
  getFirestore,
  initializeFirestore,
  persistentLocalCache
} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAh-K4jPf_6ugoEmaY8mE_JltG5zpSguvE",
  authDomain: "eventsoc-5bfa8.firebaseapp.com",
  projectId: "eventsoc-5bfa8",
  storageBucket: "eventsoc-5bfa8.appspot.com",
  messagingSenderId: "536019665706",
  appId: "1:536019665706:web:8f9d3887dcbc0104dd1453",
  measurementId: "G-BLJQFZR42D"
};

let app: FirebaseApp;
export let auth: Auth;
export let db: Firestore;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  db = initializeFirestore(app, { localCache: persistentLocalCache() });
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}
const storage = getStorage(app);

export const eventsCol = collection(db, "events");
export const eventAttendeesCol = (eventId: string) =>
  collection(eventsCol, eventId, "attendees");
export const eventCommentsCol = (eventId: string) =>
  collection(eventsCol, eventId, "comments");
export const eventCommentRepliesCol = (eventId: string, commentId: string) =>
  collection(eventCommentsCol(eventId), commentId, "replies");
export const eventUserRecScoresCol = (eventId: string) =>
  collection(eventsCol, eventId, "userRecScores");

export const usersCol = collection(db, "users");
export const userExecMemberSocieties = (userId: string) =>
  collection(usersCol, userId, "execMemberSocieties");
export const userNotificationsCol = (userId: string) =>
  collection(usersCol, userId, "notifications");
export const userEventsAttendingCol = (userId: string) =>
  collection(usersCol, userId, "eventsAttending");
export const userSocietiesFollowingCol = (userId: string) =>
  collection(usersCol, userId, "societiesFollowing");

export const societiesCol = collection(db, "societies");
export const societyExecCol = (socId: string) =>
  collection(societiesCol, socId, "exec");
export const societyEventsCol = (socId: string) =>
  collection(societiesCol, socId, "socEvents");

export const userNamesCol = collection(db, "userNames");
export const societyNamesCol = collection(db, "societyNames");

export const eventPicturesRef = ref(storage, "eventPictures");
export const societyPicturesRef = ref(storage, "societyPictures");
