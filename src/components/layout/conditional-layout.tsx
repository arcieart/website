"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { AdminNavbar } from "./admin-navbar";

const LATEST_CART_VERSION = "1";

/**
 * The promotional banner sits above the navbar on the landing page and across
 * the whole product tree (listing, category and product detail).
 */
function carriesBanner(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/products" ||
    pathname.startsWith("/products/")
  );
}

// Check and update cart version immediately when module loads on client
if (typeof window !== "undefined") {
  const cartVersion = localStorage.getItem("cartVersion");
  if (!cartVersion || cartVersion !== LATEST_CART_VERSION) {
    localStorage.setItem("cartVersion", LATEST_CART_VERSION);
    localStorage.removeItem("cart-storage");
    window.location.reload();
  }
}

export function ConditionalLayout({
  children,
  banner,
}: {
  children: React.ReactNode;
  banner?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const showBanner = carriesBanner(pathname ?? "");

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
      <div className="sticky top-0 z-50">
        {showBanner && banner}
        <Navbar />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
