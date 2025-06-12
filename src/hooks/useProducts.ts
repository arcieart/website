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
import { DBProduct, UIProduct } from "@/types/product";
import { BaseCategoriesObj } from "@/data/categories";

const getProductsRef = () => {
  const productsRef = collection(db, Collections.Products);
  const availableProductsQuery = query(
    productsRef,
    where("available", "==", true)
  );
  return availableProductsQuery;
};

export const useProducts = () => {
  // First, get the count of products to use as a cache key
  const { data: productCount } = useQuery({
    queryKey: ["products-count"],
    queryFn: async () => {
      console.log("fetching products COUNT");

      const availableProductsQuery = getProductsRef();
      const snapshot = await getCountFromServer(availableProductsQuery);
      const count = snapshot.data().count;
      console.log("products COUNT", count);
      return count;
    },
    refetchInterval: 1000 * 60 * 5, // Check count every 5 minutes
    placeholderData: (previousData) => previousData,
  });

  // Then fetch the actual products, but only when count changes
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", productCount],
    queryFn: async () => {
      console.log("fetching PRODUCTS");
      const availableProductsQuery = getProductsRef();
      const snapshot = await getDocs(availableProductsQuery);

      const products: UIProduct[] = [];
      snapshot.forEach((doc) => {
        const dbProduct = { id: doc.id, ...doc.data() } as DBProduct;
        const { id, ...restBaseCategory } = BaseCategoriesObj[dbProduct.categoryId];
        const product: UIProduct = { ...restBaseCategory, ...dbProduct };
        products.push(product);
      });

      console.log("products", products);
      return products;
    },
    enabled: productCount !== undefined && productCount > 0, // Only run when we have a count
    staleTime: 1000 * 60 * 30, // 30 minutes - products themselves don't change often
    placeholderData: (previousData) => previousData,
  });

  return {
    products: data || [],
    isLoading: isLoading || productCount === undefined,
    error,
    productCount,
  };
};
