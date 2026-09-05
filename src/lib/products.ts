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
  writeBatch,
  deleteField,
  arrayRemove,
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

export const getAllProducts = async (): Promise<DBProduct[]> => {
  const snapshot = await getDocs(collection(db, Collections.Products));
  const products: DBProduct[] = [];
  snapshot.forEach((docSnap) => {
    products.push({ id: docSnap.id, ...docSnap.data() } as DBProduct);
  });
  return products;
};

export const getProductsByIds = async (ids: string[]): Promise<DBProduct[]> => {
  if (ids.length === 0) return [];
  const docs = await Promise.all(ids.map((id) => getProductById(id)));
  return docs.filter((product): product is DBProduct => product !== null);
};

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

export const syncBundleLinks = async (
  parentId: string,
  nextBundleIds: string[],
  previousBundleIds: string[] = []
) => {
  const next = [...new Set(nextBundleIds.filter(Boolean))];
  const previous = new Set(previousBundleIds.filter(Boolean));
  const nextSet = new Set(next);
  const added = next.filter((id) => !previous.has(id));
  const removed = previousBundleIds.filter((id) => id && !nextSet.has(id));

  if (added.length === 0 && removed.length === 0) return;

  const [addedDocs, removedDocs] = await Promise.all([
    Promise.all(added.map((id) => getProductById(id))),
    Promise.all(removed.map((id) => getProductById(id))),
  ]);

  const batch = writeBatch(db);
  let operations = 0;

  addedDocs.forEach((child, index) => {
    if (!child) return;
    batch.update(doc(db, Collections.Products, added[index]), {
      parentProductId: parentId,
      isDiscoverable: false,
    });
    operations += 1;
  });

  removedDocs.forEach((child, index) => {
    if (!child) return;
    batch.update(doc(db, Collections.Products, removed[index]), {
      parentProductId: deleteField(),
    });
    operations += 1;
  });

  if (operations === 0) return;
  await batch.commit();
};

export const deleteProduct = async (id: string) => {
  try {
    const product = await getProductById(id);
    const productRef = doc(db, Collections.Products, id);

    if (!product) {
      await deleteDoc(productRef);
      return;
    }

    const batch = writeBatch(db);
    batch.delete(productRef);

    if (product.bundleIds?.length) {
      for (const bundleId of product.bundleIds) {
        const child = await getProductById(bundleId);
        if (!child) continue;
        batch.update(doc(db, Collections.Products, bundleId), {
          parentProductId: deleteField(),
        });
      }
    }

    if (product.parentProductId) {
      const parent = await getProductById(product.parentProductId);
      if (parent) {
        batch.update(doc(db, Collections.Products, product.parentProductId), {
          bundleIds: arrayRemove(id),
        });
      }
    }

    await batch.commit();
  } catch (error) {
    console.error("Error deleting product", error);
    throw error;
  }
};
