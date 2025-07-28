import { Metadata } from "next";
import ProtectedAdminPage from "./AdminPage";

export const metadata: Metadata = {
  title: "Admin | Arcie Art",
  description: "Admin page",
};

export default function AdminPage() {
  return <ProtectedAdminPage />;
}
