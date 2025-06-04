import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, where, getDocs, DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Collections } from "@/constants/Collections";
import { DBProduct } from "@/types/product";
import { BaseCategoriesIds } from "@/data/categories";

interface UseProductsProps {
  pageSize?: number;
  categoryFilter?: BaseCategoriesIds | "all";
}

interface UseProductsReturn {
  products: DBProduct[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
  totalProducts: number;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => void;
}

export const useProductsAdmin = ({ 
  pageSize = 10, 
  categoryFilter = "all" 
}: UseProductsProps = {}): UseProductsReturn => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  // const [firstVisible, setFirstVisible] = useState<DocumentSnapshot | null>(null);
  const [pageHistory, setPageHistory] = useState<DocumentSnapshot[]>([]);

  const fetchProducts = async (direction: "first" | "next" | "prev" = "first") => {
    try {
      setLoading(true);
      setError(null);

      const productsRef = collection(db, Collections.Products);
      
      // Build base query
      let q = query(productsRef, orderBy("name"));
      
      // Add category filter if not "all"
      if (categoryFilter !== "all") {
        q = query(q, where("categoryId", "==", categoryFilter));
      }

      // Add pagination
      if (direction === "next" && lastVisible) {
        q = query(q, startAfter(lastVisible), limit(pageSize));
      } else if (direction === "prev" && pageHistory.length > 0) {
        const prevDoc = pageHistory[pageHistory.length - 2];
        if (prevDoc) {
          q = query(q, startAfter(prevDoc), limit(pageSize));
        } else {
          q = query(q, limit(pageSize));
        }
      } else {
        q = query(q, limit(pageSize));
      }

      const snapshot = await getDocs(q);
      const fetchedProducts: DBProduct[] = [];
      
      snapshot.forEach((doc) => {
        fetchedProducts.push({ 
          id: doc.id, 
          ...doc.data() 
        } as DBProduct);
      });

      setProducts(fetchedProducts);

      // Update pagination state
      if (snapshot.docs.length > 0) {
        // setFirstVisible(snapshot.docs[0]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        
        if (direction === "next") {
          setPageHistory(prev => [...prev, snapshot.docs[0]]);
        } else if (direction === "prev") {
          setPageHistory(prev => prev.slice(0, -1));
        } else if (direction === "first") {
          setPageHistory([snapshot.docs[0]]);
        }
      }

      // Get total count for pagination info
      const countQuery = categoryFilter !== "all" 
        ? query(productsRef, where("categoryId", "==", categoryFilter))
        : query(productsRef);
      
      const countSnapshot = await getDocs(countQuery);
      setTotalProducts(countSnapshot.size);

    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (lastVisible) {
      setCurrentPage(prev => prev + 1);
      fetchProducts("next");
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      fetchProducts("prev");
    }
  };

  const refetch = () => {
    setCurrentPage(1);
    setPageHistory([]);
    fetchProducts("first");
  };

  // Fetch products when component mounts or filters change
  useEffect(() => {
    refetch();
  }, [categoryFilter, pageSize]);

  const hasNextPage = products.length === pageSize && (currentPage * pageSize) < totalProducts;
  const hasPrevPage = currentPage > 1;

  return {
    products,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    currentPage,
    totalProducts,
    nextPage,
    prevPage,
    refetch
  };
}; 