"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useCartSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartOpen, setCartOpenState] = useState(false);

  // Check URL parameter on mount and when search params change
  useEffect(() => {
    const cartParam = searchParams.get("cart");
    const shouldOpen = cartParam === "true";
    setCartOpenState(shouldOpen);
  }, [searchParams]);

  const setCartOpen = (open: boolean) => {
    setCartOpenState(open);

    // Update URL parameter
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (open) current.set("cart", "true");
    else current.delete("cart");

    // Convert back to string
    const search = current.toString();
    const query = search ? `?${search}` : "";

    // Update URL without refreshing the page
    if (open) {
      router.push(`${window.location.pathname}${query}`, { scroll: false });
    } else {
      router.replace(`${window.location.pathname}${query}`, { scroll: false });
    }
  };

  return { cartOpen, setCartOpen };
}
