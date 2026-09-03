import { cache } from "react";
import { Collections } from "@/constants/Collections";
import { DBProduct, UIProduct } from "@/types/product";
import { db } from "./firebase";
import {
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  collection,
  where,
  query,
  getDocs,
  limit,
} from "firebase/firestore";
import { doc } from "firebase/firestore";
import { toUIProduct } from "./product-map";

export { toUIProduct } from "./product-map";

export const getProductById = async (id: string) => {
  const productRef = doc(db, Collections.Products, id);
  const product = await getDoc(productRef);

  if (!product.exists()) {
    return null;
  }

  return { id: product.id, ...product.data() } as DBProduct;
};

export const getProductBySlug = cache(async (slug: string) => {
  const productRef = query(
    collection(db, Collections.Products),
    where("slug", "==", slug),
    limit(1)
  );

  const snapshot = await getDocs(productRef);

  if (snapshot.empty) {
    return null;
  }

  const product = {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  } as DBProduct;
  return product;
});

export const getAvailableProducts = cache(async (): Promise<UIProduct[]> => {
  const productsRef = collection(db, Collections.Products);
  const availableProductsQuery = query(
    productsRef,
    where("available", "==", true)
  );
  const snapshot = await getDocs(availableProductsQuery);

  const products: UIProduct[] = [];
  snapshot.forEach((docSnap) => {
    const dbProduct = { id: docSnap.id, ...docSnap.data() } as DBProduct;
    const uiProduct = toUIProduct(dbProduct);
    if (uiProduct) products.push(uiProduct);
  });

  return products;
});

export const addProduct = async (id: string, product: Omit<DBProduct, "id">) => {
  try {
    const productRef = doc(db, Collections.Products, id);
    await setDoc(productRef, product);
  } catch (error) {
    console.error("Error adding product", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  product: Omit<DBProduct, "id">
) => {
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
