import { Collections } from "@/constants/Collections";
import { DBProduct } from "@/types/product";
import { db } from "./firebase";
import { setDoc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";

export const getProduct = async (id: string) => {
  const productRef = doc(db, Collections.Products, id);
  const product = await getDoc(productRef);
  return product.data() as DBProduct;
};


export const addProduct = async (id: string, product: Omit<DBProduct, "id">) => {
  try {
    const productRef = doc(db, Collections.Products, id);
    await setDoc(productRef, product);
  } catch (error) {
    console.error("Error adding product", error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Omit<DBProduct, "id">) => {
  try {
    const productRef = doc(db, Collections.Products, id);
    await updateDoc(productRef, product);
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const productRef = doc(db, Collections.Products, id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product", error);
    throw error;
  }
};
