import { getApp, getApps, initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth
} from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAh-K4jPf_6ugoEmaY8mE_JltG5zpSguvE",
  authDomain: "eventsoc-5bfa8.firebaseapp.com",
  projectId: "eventsoc-5bfa8",
  storageBucket: "eventsoc-5bfa8.appspot.com",
  messagingSenderId: "536019665706",
  appId: "1:536019665706:web:8f9d3887dcbc0104dd1453",
  measurementId: "G-BLJQFZR42D"
};

let app;
export let auth: Auth;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

const db = getFirestore(app);
export const eventsCol = collection(db, "events");
export const usersCol = collection(db, "users");

const storage = getStorage(app);
export const eventPicturesRef = ref(storage, "eventPictures");
