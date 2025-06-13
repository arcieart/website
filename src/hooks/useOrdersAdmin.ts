import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDocs,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Collections } from "@/constants/Collections";
import { Order } from "@/types/order";

interface UseOrdersProps {
  pageSize?: number;
  statusFilter?: Order["status"] | "all";
}

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
  totalOrders: number;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => void;
}

interface PageCache {
  orders: Order[];
  lastVisible: DocumentSnapshot | null;
}

export const useOrdersAdmin = ({
  pageSize = 20,
  statusFilter = "all",
}: UseOrdersProps = {}): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [pageHistory, setPageHistory] = useState<DocumentSnapshot[]>([]);
  // Add cache for storing orders by page number
  const [pageCache, setPageCache] = useState<Map<number, PageCache>>(new Map());

  const fetchOrders = async (
    direction: "first" | "next" | "prev" = "first",
    targetPage?: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have cached data for the target page
      const pageToFetch = targetPage || currentPage;
      const cachedData = pageCache.get(pageToFetch);
      
      if (cachedData && direction === "prev") {
        // Use cached data for previous pages
        setOrders(cachedData.orders);
        setLastVisible(cachedData.lastVisible);
        setLoading(false);
        return;
      }

      const ordersRef = collection(db, Collections.Orders);

      // Build base query - order by creation date descending (newest first)
      let q = query(ordersRef, orderBy("createdAt", "desc"));

      // Add status filter if not "all"
      if (statusFilter !== "all") {
        q = query(q, where("status", "==", statusFilter));
      }

      // Add pagination
      if (direction === "next" && lastVisible) {
        q = query(q, startAfter(lastVisible), limit(pageSize));
      } else if (direction === "prev" && pageHistory.length > 0) {
        const prevDoc = pageHistory[pageHistory.length - 2];
        if (prevDoc) q = query(q, startAfter(prevDoc), limit(pageSize));
        else q = query(q, limit(pageSize));
      } else {
        q = query(q, limit(pageSize));
      }

      const snapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];

      snapshot.forEach((doc) => {
        fetchedOrders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      setOrders(fetchedOrders);

      // Update pagination state
      if (snapshot.docs.length > 0) {
        const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(newLastVisible);

        // Cache the current page data
        const currentPageNumber = direction === "next" ? currentPage + 1 : 
                                direction === "prev" ? currentPage - 1 : 
                                currentPage;
        
        setPageCache(prev => new Map(prev).set(currentPageNumber, {
          orders: fetchedOrders,
          lastVisible: newLastVisible
        }));

        if (direction === "next") {
          setPageHistory((prev) => [...prev, snapshot.docs[0]]);
        } else if (direction === "prev") {
          setPageHistory((prev) => prev.slice(0, -1));
        } else if (direction === "first") {
          setPageHistory([snapshot.docs[0]]);
        }
      }

      // Get total count for pagination info (only if not cached)
      if (!totalOrders || direction === "first") {
        const countQuery =
          statusFilter !== "all"
            ? query(ordersRef, where("status", "==", statusFilter))
            : query(ordersRef);

        const countSnapshot = await getDocs(countQuery);
        setTotalOrders(countSnapshot.size);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (lastVisible) {
      setCurrentPage((prev) => prev + 1);
      fetchOrders("next");
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      const targetPage = currentPage - 1;
      setCurrentPage(targetPage);
      fetchOrders("prev", targetPage);
    }
  };

  const refetch = () => {
    setCurrentPage(1);
    setPageHistory([]);
    setPageCache(new Map()); // Clear cache on refetch
    fetchOrders("first");
  };

  // Fetch orders when component mounts or filters change
  useEffect(() => {
    refetch();
  }, [statusFilter, pageSize]);

  const hasNextPage =
    orders.length === pageSize && currentPage * pageSize < totalOrders;
  const hasPrevPage = currentPage > 1;

  return {
    orders,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    currentPage,
    totalOrders,
    nextPage,
    prevPage,
    refetch,
  };
}; 