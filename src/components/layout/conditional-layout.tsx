"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { AdminNavbar } from "./admin-navbar";

const LATEST_CART_VERSION = "1";

// Check and update cart version immediately when module loads on client
if (typeof window !== "undefined") {
  const cartVersion = localStorage.getItem("cartVersion");
  if (!cartVersion || cartVersion !== LATEST_CART_VERSION) {
    localStorage.setItem("cartVersion", LATEST_CART_VERSION);
    localStorage.removeItem("cart-storage");
    window.location.reload();
  }
}

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return (
      <>
        <AdminNavbar />
        <main className="flex-1">{children}</main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
