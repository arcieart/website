"use client";

import { useState } from "react";
import { AddProductSheet, ProductSheet } from "./ProductSheet";
import { useProductsAdmin } from "@/hooks/useProductsAdmin";
import {
  BaseCategoriesIds,
  BaseCategories,
  BaseCategoriesObj,
} from "@/data/categories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  Trash2,
  Pencil,
  Copy,
} from "lucide-react";
import Image from "next/image";
import { deleteProduct } from "@/lib/products";
import { DBProduct } from "@/types/product";
import { formatPrice } from "@/utils/price";
import { toast } from "sonner";

export const ProductsManagement = () => {
  const [categoryFilter, setCategoryFilter] = useState<
    BaseCategoriesIds | "all"
  >("all");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null);
  const pageSize = 10;

  const {
    products,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    currentPage,
    totalProducts,
    nextPage,
    prevPage,
    refetch,
  } = useProductsAdmin({ pageSize, categoryFilter });

  const formatPriceAdmin = (price?: number) => {
    if (typeof price !== "number") return "N/A";
    return formatPrice(price);
  };

  const getCategoryName = (categoryId: BaseCategoriesIds) => {
    return BaseCategoriesObj[categoryId]?.name || categoryId;
  };

  const generateProductUrl = (categoryId: string, productSlug: string) => {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://arcie.art";
    return `${baseUrl}/products/${categoryId}/${productSlug}`;
  };

  const handleCopyProductUrl = async (
    categoryId: string,
    productSlug: string
  ) => {
    try {
      const productUrl = generateProductUrl(categoryId, productSlug);
      await navigator.clipboard.writeText(productUrl);
      toast.success(`Product URL copied to clipboard!`);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Failed to copy URL. Please try again.");
    }
  };

  const handleEditProduct = (product: DBProduct) => {
    setEditingProduct(product);
  };

  const handleProductUpdated = () => {
    refetch();
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingIds((prev) => new Set(prev).add(productId));
      await deleteProduct(productId);
      // Refetch products to update the list
      refetch();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-semibold mb-2">Error loading products</p>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Products Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog with search and pagination
          </p>
        </div>
        <AddProductSheet onProductSaved={refetch} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm font-medium">
            Filter by category:
          </label>
          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              setCategoryFilter(value as BaseCategoriesIds | "all")
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {BaseCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={refetch}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4  ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading products...
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="text-muted-foreground">
                    {categoryFilter === "all"
                      ? "No products found. Add your first product to get started."
                      : `No products found in the ${getCategoryName(
                          categoryFilter as BaseCategoriesIds
                        )} category.`}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          No image
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {getCategoryName(product.categoryId)}
                    </span>
                  </TableCell>
                  <TableCell>{formatPriceAdmin(product.price)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.available
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        }`}
                      >
                        {product.available ? "Available" : "Unavailable"}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isDiscoverable
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
                        }`}
                      >
                        {product.isDiscoverable ? "Discoverable" : "Hidden"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate text-sm text-muted-foreground">
                      {product.description || "No description"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopyProductUrl(product.categoryId, product.slug)
                        }
                        title="Copy product URL"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                        onClick={() =>
                          handleDeleteProduct(product.id, product.name)
                        }
                        disabled={deletingIds.has(product.id)}
                      >
                        {deletingIds.has(product.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {Math.ceil(totalProducts / pageSize)}{" "}
            ({totalProducts} total products)
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={prevPage}
                  className={
                    !hasPrevPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>

              {hasNextPage && (
                <PaginationItem>
                  <PaginationLink onClick={nextPage} className="cursor-pointer">
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={nextPage}
                  className={
                    !hasNextPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit Product Sheet - Rendered once */}
      {editingProduct && (
        <ProductSheet
          product={editingProduct}
          onProductSaved={handleProductUpdated}
          isOpen={!!editingProduct}
          onOpenChange={(open) => {
            if (!open) setEditingProduct(null);
          }}
        />
      )}
    </>
  );
};
