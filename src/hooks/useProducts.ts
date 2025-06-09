import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Collections } from "@/constants/Collections";
import { DBProduct } from "@/types/product";

export const useProducts = () => {
  // First, get the count of products to use as a cache key
  const { data: productCount } = useQuery({
    queryKey: ["products-count"],
    queryFn: async () => {
      const productsRef = collection(db, Collections.Products);
      const availableProductsQuery = query(
        productsRef,
        where("available", "==", true)
      );
      const snapshot = await getCountFromServer(availableProductsQuery);
      return snapshot.data().count;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - count changes less frequently
    refetchInterval: 1000 * 60 * 5, // Check count every 5 minutes
  });

  // Then fetch the actual products, but only when count changes
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", productCount],
    queryFn: async () => {
      console.log("fetching products");
      const productsRef = collection(db, Collections.Products);
      const availableProductsQuery = query(
        productsRef,
        where("available", "==", true)
      );
      const snapshot = await getDocs(availableProductsQuery);

      const products: DBProduct[] = [];
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as DBProduct);
      });

      return products;
    },
    enabled: typeof productCount === "number", // Only run when we have a count
    staleTime: 1000 * 60 * 30, // 30 minutes - products themselves don't change often
  });

  return {
    data: data || [],
    isLoading: isLoading || productCount === undefined,
    error,
    productCount,
  };
};
