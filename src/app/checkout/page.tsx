import { Metadata } from "next";
import CheckoutPage from "./CheckoutPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Checkout",
  description: "Checkout",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPageWrapper() {
  return <CheckoutPage />;
}
