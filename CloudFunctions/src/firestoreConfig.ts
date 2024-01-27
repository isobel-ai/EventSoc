import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp();

const db = getFirestore(app);
export const usersCol = db.collection("users");
