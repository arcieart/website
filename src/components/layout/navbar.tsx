"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import { BaseCategories } from "@/data/categories";
import Image from "next/image";

const navigation = [
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
];

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems);
  const favoriteItems = useFavoritesStore((state) => state.items);

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/full-logo.svg"
                alt="arcie.art logo"
                width={100}
                height={100}
                className="w-24"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 ml-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="outline"
                size="sm"
                className="relative group border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-200"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-semibold border-2 border-white"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </Badge>
                  )}
                </div>
                <span className="hidden sm:inline ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  Cart
                </span>
              </Button>
            </Link>

            {/* Favorites */}
            <Link href="/favorites">
              <Button
                variant="outline"
                size="sm"
                className="relative group border-gray-200 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-200"
              >
                <div className="relative">
                  <Heart
                    className={`w-4 h-4 transition-all duration-200 ${
                      favoriteItems.length > 0
                        ? "text-pink-500 fill-pink-500 group-hover:text-pink-600 group-hover:fill-pink-600"
                        : "text-gray-600 group-hover:text-pink-500"
                    }`}
                  />
                  {favoriteItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-semibold border-2 border-white bg-pink-500 hover:bg-pink-600 text-white">
                      {favoriteItems.length > 99 ? "99+" : favoriteItems.length}
                    </Badge>
                  )}
                </div>
                <span className="hidden sm:inline ml-2 text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">
                  Favorites
                </span>
              </Button>
            </Link>

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
                  <DropdownMenuLabel>Products</DropdownMenuLabel>
                  {BaseCategories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        href={`/products/${category.id}`}
                        className="w-full"
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
  );
}
