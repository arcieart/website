"use client";

import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  BaseCustomizationsObj,
  PLAFilamentColors,
} from "@/data/customizations";
import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import {
  formatPrice,
  getStrikethroughPrice,
  calculateProductPrice,
} from "@/utils/price";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { UIProduct } from "@/types/product";
import { ProductPageImageCarousel } from "@/components/carousels/ProductPageImageCarousel";
import { Customization, DBCustomization } from "@/types/customization";
import Link from "next/link";
import { QuantityStepper } from "@/components/misc/QuantityStepper";
import { useCartSheet } from "@/hooks/useCartSheet";
import { ProductSpecAccordion } from "@/components/accordion/ProductSpecAccordion";
import { DotSeparator } from "@/components/misc/DotSeparator";
import { ProductPageSkeleton } from "@/components/skeletons/ProductPageSkeleton";
import { Materials } from "@/data/materials";
import { getWhatsappCustomizationHelpLink } from "@/utils/whatsappMessageLinks";
import { RecommendedProducts } from "@/components/products/RecommendedProducts";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Markdown from "react-markdown";

interface ProductPageProps {
  params: Promise<{ productSlug: string }>;
}

const CustomizationLabel = ({ label, required }: Partial<Customization>) => (
  <Label className="gap-1">
    {label}
    {required && <span className="text-red-500">*</span>}
  </Label>
);

export function ProductPage({ params }: ProductPageProps) {
  const { products, isLoading } = useProducts();
  const { toggleItem, isInFavorites } = useFavoritesStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { setCartOpen } = useCartSheet();
  const router = useRouter();

  const [resolvedParams, setResolvedParams] = useState<{
    productSlug: string;
  }>();
  const [product, setProduct] = useState<UIProduct>();
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Record<string, string>>(
    {}
  );

  // Resolve params in useEffect
  useEffect(() => {
    params.then((params) =>
      setResolvedParams({ productSlug: params.productSlug })
    );
  }, [params]);

  useEffect(() => {
    if (products && resolvedParams && !isLoading) {
      const product = products.find(
        (p) => p.slug === resolvedParams.productSlug
      );
      if (product) setProduct(product);
      else {
        toast.error("Product not found, redirecting to products page...");
        setTimeout(() => {
          router.replace("/products");
        }, 2000);
      }
    }
  }, [products, resolvedParams, isLoading]);

  if (!resolvedParams || isLoading || !product) {
    return <ProductPageSkeleton />;
  }

  const isInWishlist = isInFavorites(product.id);

  const handleCustomizationChange = (
    customizationId: string,
    value: string
  ) => {
    setCustomizations((prev) => ({ ...prev, [customizationId]: value }));
  };

  const calculateTotalPrice = () => {
    return calculateProductPrice(product.price, customizations, quantity);
  };

  const handleAddToCart = () => {
    // Check if all required customizations are filled
    const missingCustomizations = product.customizationOptions
      .filter(
        (option) =>
          BaseCustomizationsObj[option.customizationRefId].required &&
          !customizations[option.customizationRefId]
      )
      .map(
        (option) =>
          BaseCustomizationsObj[option.customizationRefId].afterSelectionLabel
      );

    if (missingCustomizations.length > 0) {
      toast.error(`Please select ${missingCustomizations.join(", ")}`);
      return;
    }

    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addToCart(product, customizations);
    }

    setCartOpen(true);
  };

  const handleToggleFavorite = () => {
    toggleItem(product.id);
  };

  const renderCustomizationInput = (customizationParam: DBCustomization) => {
    const baseCustomization =
      BaseCustomizationsObj[customizationParam.customizationRefId];
    if (!baseCustomization) return null;

    const customization: Customization = {
      ...baseCustomization,
      ...customizationParam,
    };

    switch (customization.type) {
      case "input":
        return (
          <div key={customization.id} className="space-y-2">
            <CustomizationLabel
              label={customization.label}
              required={customization.required}
            />
            <Input
              id={customization.id}
              type="text"
              placeholder={customization.placeholder || "Enter text"}
              value={customizations[customization.id] || ""}
              onChange={(e) =>
                handleCustomizationChange(customization.id, e.target.value)
              }
              maxLength={customization.maxLength}
              minLength={customization.minLength}
            />
            {customization.maxLength && (
              <p className="text-xs text-muted-foreground">
                {(customizations[customization.id] || "").length}/
                {customization.maxLength} characters
              </p>
            )}
          </div>
        );

      case "fixed-color-picker":
        const selectedColor = customizations[customization.id];
        const selectedColorObj = PLAFilamentColors.find(
          (c) => c.id === selectedColor
        );
        return (
          <div key={customization.id} className="space-y-2">
            <CustomizationLabel
              label={customization.label}
              required={customization.required}
            />
            <TooltipProvider>
              <div className="flex flex-wrap gap-3">
                {PLAFilamentColors.filter((color) => color.available).map(
                  (color) => (
                    <Tooltip key={color.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() =>
                            handleCustomizationChange(
                              customization.id,
                              color.id
                            )
                          }
                          className={`relative w-10 h-10 rounded-full border-1 transition-all hover:scale-110 focus:outline-none ${
                            selectedColor === color.id
                              ? "shadow-lg border-primary border-2"
                              : "border-border hover:shadow-md"
                          }`}
                          style={{ backgroundColor: color.value }}
                          aria-label={`Select ${color.label} color`}
                        >
                          {color.assetType === "image" && (
                            <Image
                              src={color.value}
                              alt={color.label}
                              className="object-cover w-full h-full rounded-full"
                              width={40}
                              height={40}
                            />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{color.label}</p>
                          {color.priceAdd > 0 && (
                            <p className="text-xs">
                              +{formatPrice(color.priceAdd)}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                )}
              </div>
            </TooltipProvider>
            {selectedColorObj && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-start gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: selectedColorObj.value }}
                    >
                      {selectedColorObj.assetType === "image" && (
                        <Image
                          src={selectedColorObj.value}
                          alt={selectedColorObj.label}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {selectedColorObj.label}
                    </span>
                  </div>
                  {selectedColorObj.priceAdd > 0 && (
                    <span className="text-xs text-muted-foreground">
                      +{formatPrice(selectedColorObj.priceAdd)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "select":
        return (
          <div key={customization.id} className="space-y-2">
            <CustomizationLabel
              label={customization.label}
              required={customization.required}
            />
            <Select
              value={customization.id || ""}
              onValueChange={(value) => {
                handleCustomizationChange(customization.id, value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {customization.options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/products/${product.categoryId}`}>
                  <span className="capitalize">
                    {product.categoryId.replace("-", " ")}
                  </span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-20">
          {/* Product Images */}
          <div className="md:sticky md:top-18 md:self-start">
            <ProductPageImageCarousel
              images={product.images}
              alt={product.name}
              product={product}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href={`/products/${product.categoryId}`}>
                  <span className="text-sm text-muted-foreground capitalize hover:text-primary transition-colors duration-200">
                    {product.categoryId.replace("-", " ")}
                  </span>
                </Link>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.isBestSeller && (
                  <Badge variant="default">Best Seller</Badge>
                )}
              </div>

              {/* Price */}
              <div className="">
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(getStrikethroughPrice(product.price))}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (excl. shipping)
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              {product.description && (
                <div className="text-sm text-muted-foreground space-y-2">
                  <Markdown>{product.description}</Markdown>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {product.baseDescription}
              </p>
              <p className="text-sm text-muted-foreground">
                Looking to customize further? Reach out to us on{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getWhatsappCustomizationHelpLink(product)}
                >
                  <Button variant="link" className="p-0">
                    WhatsApp
                  </Button>
                </Link>
                .
              </p>
              <p className="text-sm text-muted-foreground">
                All products are proudly made in India. 🇮🇳
              </p>
            </div>

            {/* Customization Options */}
            {product.customizationOptions.length > 0 && (
              <>
                <Separator />
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Customize Your Product
                  </h3>
                  {product.customizationOptions.map(renderCustomizationInput)}
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-4">
              <QuantityStepper
                quantity={quantity}
                increment={() => setQuantity(quantity + 1)}
                decrement={() => setQuantity(Math.max(1, quantity - 1))}
              />
              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                  <DotSeparator />
                  {formatPrice(calculateTotalPrice())}
                </Button>
                <Button
                  onClick={handleToggleFavorite}
                  variant="outline"
                  size="lg"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist
                        ? "fill-red-500 text-red-500"
                        : "text-foreground/80"
                    }`}
                  />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Product Details
              </h2>

              {product.weight && (
                <div className="flex py-2">
                  <span className="font-medium text-foreground text-sm w-24">
                    Weight:
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {product.weight}g
                  </span>
                </div>
              )}

              <div className="flex py-2">
                <span className="font-medium text-foreground text-sm w-24">
                  Material:
                </span>
                <span className="text-muted-foreground text-sm">
                  {Materials[product.material].name}
                </span>
              </div>

              {product.dimensions && (
                <div className="flex py-2">
                  <span className="font-medium text-foreground text-sm w-24">
                    Dimensions:
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {product.dimensions.split("x").join("×")}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Product Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">
                Product Specifications
              </h3>
              <ProductSpecAccordion product={product} />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Related Products */}
        <RecommendedProducts currentProduct={product} />
      </div>
    </div>
  );
}
