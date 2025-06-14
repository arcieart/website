import { auth } from "./firebase";
import {
    signInAnonymously as signInAnonymouslyFirebase,
    signInWithEmailAndPassword,
  } from "firebase/auth";

export const signInAnonymously = async () => {
    try {
      const user = await signInAnonymouslyFirebase(auth);
      // console.log("signed in anonymously", user);
    } catch (error) {
      console.error("error while signing in anonymously", error);
      throw error;
    }
  };

export const signInWithEmailAndPasswordAuth = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // console.log("signed in with email and password", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("error while signing in with email and password", error);
    throw error;
  }
};
  

  