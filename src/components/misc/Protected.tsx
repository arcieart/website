"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { hash, isProduction } from "@/utils/misc";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const isDev = !isProduction;

export function Protected({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) setTimeout(() => setError(""), 2000);
  }, [error]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hashedPassword = hash(input).toString();
    checkAdmin(hashedPassword);
  };

  useEffect(() => {
    const storedHash = localStorage.getItem("ADMIN_PASSWORD_HASH");
    if (storedHash) {
      checkAdmin(storedHash);
    }
  }, []);

  function checkAdmin(hashedPassword: string) {
    if (hashedPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH)
      setIsAdmin(true);
    else {
      setError("Invalid password");
      setInput("");
    }
  }

  if (isDev || isAdmin || true) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Label>Enter password</Label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={cn(error && "focus-visible:ring-destructive")}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
