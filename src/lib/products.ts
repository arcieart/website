import { Collections } from "@/constants/Collections";
import { DBProduct } from "@/types/product";
import { db } from "./firebase";
import { setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";

export const addProduct = async (id: string, product: DBProduct) => {
  try {
    const productRef = doc(db, Collections.Products, id);
    await setDoc(productRef, product);
  } catch (error) {
    console.error("Error adding product", error);
    throw error;
  }
};
