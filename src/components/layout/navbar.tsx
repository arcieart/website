"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import { BaseCategories } from "@/data/categories";
import { FullLogo } from "../logos/FullLogo";
import CartSheet from "./CartSheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { isProduction } from "@/utils/misc";
import { NavBarBanner } from "../banners/TopLayoutBanner";

const navigation = [{ name: "All Products", href: "/products" }];

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems);
  const favoriteItemIds = useFavoritesStore((state) => state.itemIds);

  return (
    <>
      <NavBarBanner />
      <nav className="bg-background border-b sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <FullLogo />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8 ml-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary text-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!isProduction && <ThemeToggle />}
              <Link href="/favorites">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative group transition-colors hover:bg-muted`}
                >
                  <div
                    className={`relative ${
                      favoriteItemIds.length > 0
                        ? "text-destructive hover:text-destructive"
                        : "text-foreground hover:text-destructive"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${
                        favoriteItemIds.length > 0 ? "fill-current" : ""
                      }`}
                    />
                    {favoriteItemIds.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 min-h-4 min-w-4 flex items-center justify-center py-0 px-1 text-[10px] font-semibold border-2 border-background bg-destructive text-white">
                        {favoriteItemIds.length > 99
                          ? "99+"
                          : favoriteItemIds.length}
                      </Badge>
                    )}
                  </div>
                  <span className="hidden sm:inline ml-1 text-sm font-medium text-foreground">
                    Favorites
                  </span>
                </Button>
              </Link>

              <CartSheet>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative group text-foreground hover:bg-muted transition-colors"
                >
                  <div className="relative">
                    <ShoppingCart className="w-4 h-4" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-3 min-h-4 min-w-4 flex items-center justify-center py-0 px-1 text-[10px] font-semibold border-2 border-background bg-destructive text-white">
                        {totalItems > 99 ? "99+" : totalItems}
                      </Badge>
                    )}
                  </div>
                  <span className="hidden sm:inline ml-1 text-sm font-medium">
                    Cart
                  </span>
                </Button>
              </CartSheet>

              {/* Mobile Menu Dropdown */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="w-5 h-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Collections</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/products`} className="text-xs">
                        All Products
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuLabel>Categories</DropdownMenuLabel>
                    {BaseCategories.map((category) => (
                      <DropdownMenuItem key={category.id} asChild>
                        <Link
                          href={`/products/${category.id}`}
                          className="text-xs"
                        >
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
