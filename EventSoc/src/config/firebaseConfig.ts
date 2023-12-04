import { initializeApp } from "firebase/app";
import { inMemoryPersistence, initializeAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAh-K4jPf_6ugoEmaY8mE_JltG5zpSguvE",
  authDomain: "eventsoc-5bfa8.firebaseapp.com",
  projectId: "eventsoc-5bfa8",
  storageBucket: "eventsoc-5bfa8.appspot.com",
  messagingSenderId: "536019665706",
  appId: "1:536019665706:web:8f9d3887dcbc0104dd1453",
  measurementId: "G-BLJQFZR42D"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, { persistence: inMemoryPersistence });

const db = getFirestore(app);
export const eventsCol = collection(db, "events");

const storage = getStorage(app);
export const eventPicturesRef = ref(storage, "eventPictures");
