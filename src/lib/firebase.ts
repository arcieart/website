import { Collections } from "@/constants/Collections";
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";
import { getFirestore, collection, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: "640897736580",
  appId: "1:640897736580:web:da03e77701ee987c6587d1",
  measurementId: "G-K4B9S27QWE",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const getNewProductDocId = async () => {
  const productsRef = collection(db, Collections.Products);
  const newDocRef = doc(productsRef);
  return newDocRef.id;
};
