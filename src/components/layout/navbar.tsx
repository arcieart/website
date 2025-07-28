"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Menu, ChevronDown } from "lucide-react";
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

// Reusable component for category dropdown
function CategoryDropdown({ isMobile = false }: { isMobile?: boolean }) {
  const textSize = isMobile ? "text-xs" : "text-sm";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`${textSize} text-foreground`}>
          {isMobile ? <Menu className="w-5 h-5" /> : "All Products"}
          {!isMobile && <ChevronDown className="w-3 h-3 ml-1" />}
          {isMobile && <span className="sr-only">Open menu</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "end" : "start"} className="w-56">
        <DropdownMenuLabel>Products</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/products" className={textSize}>
            All Products
          </Link>
        </DropdownMenuItem>
        {BaseCategories.map((category) => (
          <DropdownMenuItem key={category.id} asChild>
            <Link href={`/products/${category.id}`} className={textSize}>
              {category.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Reusable component for icon buttons with badges
function IconButton({
  href,
  icon: Icon,
  label,
  count,
  isActive = false,
  wrapper: Wrapper,
}: {
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  isActive?: boolean;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const buttonContent = (
    <Button
      variant="ghost"
      size="sm"
      className="relative group text-foreground hover:bg-muted transition-colors"
    >
      <div className="relative">
        <Icon
          className={`w-4 h-4 transition-all ${
            isActive
              ? "fill-current text-destructive hover:text-destructive"
              : "hover:text-destructive"
          }`}
        />
        {count > 0 && (
          <Badge className="absolute -top-2 -right-2 min-h-4 min-w-4 flex items-center justify-center py-0 px-1 text-[10px] font-semibold border-2 border-background bg-destructive text-white">
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </div>
      <span className="hidden sm:inline ml-1 text-sm font-medium">{label}</span>
    </Button>
  );

  if (Wrapper) {
    return <Wrapper>{buttonContent}</Wrapper>;
  }

  return href ? <Link href={href}>{buttonContent}</Link> : buttonContent;
}

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems);
  const favoriteItemIds = useFavoritesStore((state) => state.itemIds);

  return (
    <>
      <NavBarBanner />
      <nav className="bg-background border-b sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Desktop Navigation */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <FullLogo />
              </Link>

              <div className="hidden md:flex items-center space-x-8 ml-8">
                <CategoryDropdown />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-1">
              {!isProduction && <ThemeToggle />}

              <IconButton
                href="/favorites"
                icon={Heart}
                label="Favorites"
                count={favoriteItemIds.length}
                isActive={favoriteItemIds.length > 0}
              />

              <IconButton
                label="Cart"
                icon={ShoppingCart}
                count={totalItems}
                wrapper={CartSheet}
              />

              {/* Mobile Menu */}
              <div className="md:hidden">
                <CategoryDropdown isMobile />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
