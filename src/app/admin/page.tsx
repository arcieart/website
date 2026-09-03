import { Metadata } from "next";
import ProtectedAdminPage from "./AdminPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Admin",
  description: "Admin",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return <ProtectedAdminPage />;
}
