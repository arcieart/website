import { Metadata } from "next";
import CheckoutPage from "./CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout | Arcie Art",
  description: "Checkout page",
};

export default function CheckoutPageWrapper() {
  return <CheckoutPage />;
}
