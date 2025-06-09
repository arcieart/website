"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullLogo } from "../logos/FullLogo";

const adminNavigation = [
  { name: "Home", href: "/", icon: Home },
  // These can be uncommented when needed
  // { name: "Terms", href: "/terms" },
  // { name: "Privacy", href: "/privacy" },
];

export function AdminNavbar() {
  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FullLogo />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {adminNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted transition-colors"
                  >
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 mr-2" />
                    )}
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
