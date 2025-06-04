"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { BaseCategories, BaseCategoriesIds } from "@/data/categories";
import { BaseCustomizations } from "@/data/customizations";
import { DBProduct } from "@/types/product";
import { DBCustomization } from "@/types/customization";

// Helper function to clean object of undefined/empty values
const cleanObject = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj
      .map(cleanObject)
      .filter((item) => item !== null && item !== undefined && item !== "");
  }

  if (obj !== null && typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = cleanObject(value);
      if (
        cleanedValue !== null &&
        cleanedValue !== undefined &&
        cleanedValue !== ""
      ) {
        if (Array.isArray(cleanedValue) && cleanedValue.length > 0) {
          cleaned[key] = cleanedValue;
        } else if (
          typeof cleanedValue === "object" &&
          Object.keys(cleanedValue).length > 0
        ) {
          cleaned[key] = cleanedValue;
        } else if (typeof cleanedValue !== "object") {
          cleaned[key] = cleanedValue;
        }
      }
    });
    return Object.keys(cleaned).length > 0 ? cleaned : null;
  }

  return obj;
};

export function AddProductsSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [productData, setProductData] = useState<DBProduct>({
    id: "",
    name: "",
    description: "",
    images: [""],
    price: 0,
    categoryId: "keychains",
    customizationOptions: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanedData = cleanObject(productData);
      console.log("Clean Product data:", cleanedData);

      // Reset form
      setProductData({
        id: "",
        name: "",
        description: "",
        images: [""],
        price: 0,
        categoryId: "keychains",
        customizationOptions: [],
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const addCustomization = () => {
    setProductData((prev) => ({
      ...prev,
      customizationOptions: [
        ...prev.customizationOptions,
        {
          customizationRefId: "",
        },
      ],
    }));
  };

  const addImage = () => {
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImage = (index: number) => {
    if (productData.images.length > 1) {
      setProductData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const removeCustomization = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      customizationOptions: prev.customizationOptions.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateImage = (index: number, value: string) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  const updateCustomization = (
    index: number,
    field: keyof DBCustomization,
    value: unknown
  ) => {
    setProductData((prev) => ({
      ...prev,
      customizationOptions: prev.customizationOptions.map((option, i) => {
        if (i !== index) return option;

        // If there's a customizationRefId, check if the new value is different from base value
        if (
          option.customizationRefId &&
          BaseCustomizations[option.customizationRefId]
        ) {
          const baseCustomization =
            BaseCustomizations[option.customizationRefId];
          const baseValue =
            baseCustomization[field as keyof typeof baseCustomization];

          // If the new value equals the base value, remove the override
          if (
            value === baseValue ||
            (value === "" && baseValue === undefined)
          ) {
            const newOption = { ...option };
            delete newOption[field];
            return newOption;
          }
        }

        // Set the override value
        return { ...option, [field]: value } as DBCustomization;
      }),
    }));
  };

  const loadBaseCustomization = (customizationRefId: string, index: number) => {
    if (customizationRefId && BaseCustomizations[customizationRefId]) {
      setProductData((prev) => ({
        ...prev,
        customizationOptions: prev.customizationOptions.map((option, i) =>
          i === index ? { customizationRefId } : option
        ),
      }));
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[700px] sm:max-w-none overflow-y-auto p-8">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl">Add New Product</SheetTitle>
          <SheetDescription className="text-base">
            Create a new product with customization options
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Product Info */}
          <div className="space-y-6 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Category
              </label>
              <Select
                value={productData.categoryId}
                onValueChange={(value) =>
                  setProductData((prev) => ({
                    ...prev,
                    categoryId: value as BaseCategoriesIds,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {BaseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Product Name
              </label>
              <Input
                placeholder="Enter product name"
                value={productData.name}
                onChange={(e) =>
                  setProductData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Description
              </label>
              <Textarea
                placeholder="Enter product description"
                className="min-h-24"
                value={productData.description}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Price (₹)
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={productData.price}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="space-y-6 p-6 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Product Images</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImage}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </div>

            <div className="space-y-3">
              {productData.images.map((image, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Image URL"
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                    />
                  </div>
                  {productData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6 p-6 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customization Options</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomization}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Customization
              </Button>
            </div>

            <div className="space-y-6">
              {productData.customizationOptions.map((option, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-6 space-y-6 bg-muted/20"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-lg">
                      Customization Option {index + 1}
                      {option.customizationRefId &&
                        BaseCustomizations[option.customizationRefId] && (
                          <span className="text-sm font-normal text-muted-foreground ml-2">
                            (Based on:{" "}
                            {
                              BaseCustomizations[option.customizationRefId]
                                .label
                            }
                            )
                          </span>
                        )}
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCustomization(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Base Customization Selector */}
                  <div className="p-4 bg-background rounded-md border">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">
                        Load from Base Customizations
                      </label>
                      {option.customizationRefId && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateCustomization(index, "customizationRefId", "")
                          }
                        >
                          Clear Base
                        </Button>
                      )}
                    </div>
                    <Select
                      value={option.customizationRefId || ""}
                      onValueChange={(value) =>
                        loadBaseCustomization(value, index)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a base customization to load" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(BaseCustomizations)
                          .filter(
                            ([, customization]) =>
                              customization.categoryId ===
                              productData.categoryId
                          )
                          .map(([id, customization]) => (
                            <SelectItem key={id} value={id}>
                              {customization.label} ({customization.type})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {option.customizationRefId &&
                      BaseCustomizations[option.customizationRefId] && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Base values:{" "}
                          {BaseCustomizations[option.customizationRefId].label}{" "}
                          •{BaseCustomizations[option.customizationRefId].type}{" "}
                          • ₹
                          {
                            BaseCustomizations[option.customizationRefId]
                              .priceAdd
                          }{" "}
                          •
                          {BaseCustomizations[option.customizationRefId]
                            .required
                            ? "Required"
                            : "Optional"}
                        </div>
                      )}
                  </div>

                  {/* Override Fields - Only show if base customization is selected */}
                  {option.customizationRefId &&
                    BaseCustomizations[option.customizationRefId] && (
                      <div className="space-y-4 p-4 border rounded-md">
                        <h5 className="font-medium text-sm text-muted-foreground">
                          Override Base Values (Optional)
                        </h5>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Label Override
                            </label>
                            <Input
                              placeholder={
                                BaseCustomizations[option.customizationRefId]
                                  .label
                              }
                              value={String(option.label || "")}
                              onChange={(e) =>
                                updateCustomization(
                                  index,
                                  "label",
                                  e.target.value || undefined
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Add Price Override (₹)
                            </label>
                            <Input
                              type="number"
                              placeholder={String(
                                BaseCustomizations[option.customizationRefId]
                                  .priceAdd
                              )}
                              value={
                                option.priceAdd !== undefined
                                  ? String(option.priceAdd)
                                  : ""
                              }
                              onChange={(e) =>
                                updateCustomization(
                                  index,
                                  "priceAdd",
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={
                              option.required !== undefined
                                ? option.required
                                : BaseCustomizations[option.customizationRefId]
                                    .required
                            }
                            onCheckedChange={(checked) =>
                              updateCustomization(
                                index,
                                "required",
                                checked !==
                                  BaseCustomizations[option.customizationRefId]
                                    .required
                                  ? checked
                                  : undefined
                              )
                            }
                          />
                          <label className="text-sm font-medium">
                            Required (Base:{" "}
                            {BaseCustomizations[option.customizationRefId]
                              .required
                              ? "Yes"
                              : "No"}
                            )
                          </label>
                        </div>

                        {BaseCustomizations[option.customizationRefId].type ===
                          "input" && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Placeholder Override
                            </label>
                            <Input
                              placeholder="Enter placeholder text"
                              value={String(
                                (option as { placeholder?: string })
                                  .placeholder || ""
                              )}
                              onChange={(e) =>
                                updateCustomization(
                                  index,
                                  "placeholder" as keyof DBCustomization,
                                  e.target.value || undefined
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
