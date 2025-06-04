"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useIsMobile from "@/hooks/useIsMobile";
import { hash } from "@/utils/misc";
import { useEffect, useLayoutEffect, useState } from "react";
import { signInWithEmailAndPasswordAuth } from "@/lib/firebase-auth";
import { ProductsManagement } from "./ProductsManagement";

export default function ProtectedAdminPage() {
  const isMobile = useIsMobile();

  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const storedHash = localStorage.getItem("ADMIN_PASSWORD_HASH");
    (async () => {
      if (storedHash) await checkAdmin(storedHash);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (error) setTimeout(() => setError(""), 3000);
  }, [error]);

  const checkAdmin = async (hashedPassword: string) => {
    const adminHash = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH;

    if (hashedPassword === adminHash) {
      localStorage.setItem("ADMIN_PASSWORD_HASH", adminHash);
      await signInWithEmailAndPasswordAuth("myarcieart@gmail.com", adminHash);
      setIsAdmin(true);
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hashedPassword = hash(password).toString();
    checkAdmin(hashedPassword);
  };

  if (isLoading) return null;

  if (isMobile)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Please use a desktop browser to access this page.
      </div>
    );

  return isAdmin ? (
    <div className="flex flex-col gap-4 container mx-auto py-10 mt-16 min-h-screen">
      <Tabs defaultValue="products">
        <TabsList className="flex flex-row gap-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex flex-col gap-4">
            <ProductsManagement />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Orders</h2>
              <Button variant="outline">Export</Button>
            </div>
            <div className="border rounded-lg p-6 text-center text-muted-foreground">
              <p>Order management will be displayed here</p>
              <p className="text-sm mt-2">View and manage customer orders</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={onSubmit}>
        <div className="flex flex-row gap-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            className={`${error ? "border-destructive" : ""}`}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
