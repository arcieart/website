"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Code } from "lucide-react";
import { DBProduct } from "@/types/product";
import { updateProduct } from "@/lib/products";
import { BaseCategoriesIds } from "@/data/categories";
import { DBCustomization } from "@/types/customization";

interface ProductJSONDialogProps {
  product: DBProduct;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProductUpdated?: () => void;
}

// Schema validation function
const validateDBProductSchema = (
  data: DBProduct
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required fields
  if (typeof data.name !== "string" || !data.name.trim()) {
    errors.push("name must be a non-empty string");
  }

  if (!Array.isArray(data.images)) {
    errors.push("images must be an array");
  } else if (data.images.some((img: string) => typeof img !== "string")) {
    errors.push("all images must be strings");
  }

  // Check categoryId
  const validCategories: BaseCategoriesIds[] = [
    "keychains",
    "earrings",
    "lithophanes",
    "coasters",
  ];
  if (!validCategories.includes(data.categoryId)) {
    errors.push(`categoryId must be one of: ${validCategories.join(", ")}`);
  }

  // Check optional fields
  if (
    data.price !== undefined &&
    (typeof data.price !== "number" || data.price < 0)
  ) {
    errors.push("price must be a positive number");
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    errors.push("description must be a string");
  }

  if (!Array.isArray(data.customizationOptions)) {
    errors.push("customizationOptions must be an array");
  } else {
    data.customizationOptions.forEach(
      (option: DBCustomization, index: number) => {
        if (
          typeof option.customizationRefId !== "string" ||
          !option.customizationRefId.trim()
        ) {
          errors.push(
            `customizationOptions[${index}].customizationRefId must be a non-empty string`
          );
        }
      }
    );
  }

  return { isValid: errors.length === 0, errors };
};

export function ProductJSONDialog({
  product,
  isOpen,
  onOpenChange,
  onProductUpdated,
}: ProductJSONDialogProps) {
  const [jsonData, setJsonData] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [jsonError, setJsonError] = useState<string>("");
  const [schemaErrors, setSchemaErrors] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize JSON data when product changes
  useEffect(() => {
    if (product && isOpen) {
      // Remove the id field from the product data for editing
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...productWithoutId } = product;
      setJsonData(JSON.stringify(productWithoutId, null, 2));
      setJsonError("");
      setSchemaErrors([]);
    }
  }, [product, isOpen]);

  const validateJSON = (jsonString: string): boolean => {
    try {
      const parsedData = JSON.parse(jsonString);
      setJsonError("");

      // Validate against schema
      const schemaValidation = validateDBProductSchema(parsedData);
      setSchemaErrors(schemaValidation.errors);

      return schemaValidation.isValid;
    } catch (error) {
      setJsonError(
        `Invalid JSON: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setSchemaErrors([]);
      return false;
    }
  };

  const formatJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonData);
      const formatted = JSON.stringify(parsed, null, 2);

      // Only update if the formatting actually changed
      if (formatted !== jsonData) {
        const textarea = textareaRef.current;
        const cursorPosition = textarea?.selectionStart || 0;

        setJsonData(formatted);

        // Attempt to preserve cursor position relative to content
        setTimeout(() => {
          if (textarea) {
            const newPosition = Math.min(cursorPosition, formatted.length);
            textarea.setSelectionRange(newPosition, newPosition);
            textarea.focus();
          }
        }, 0);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Don't format if JSON is invalid - validation errors will show
    }
  }, [jsonData]);

  const handleJSONChange = (value: string) => {
    setJsonData(value);
    if (value.trim()) {
      validateJSON(value);
    } else {
      setJsonError("");
      setSchemaErrors([]);
    }
  };

  const handleSave = async () => {
    if (!product || !validateJSON(jsonData)) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to update "${product.name}" with this JSON data?`
    );

    if (!confirmed) return;

    setIsUpdating(true);

    try {
      const updatedData = JSON.parse(jsonData);
      await updateProduct(product.id, updatedData);
      onProductUpdated?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const hasErrors = !!jsonError || schemaErrors.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Product {product?.name}</DialogTitle>
          <DialogDescription>Product ID: {product.id}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Product JSON Data</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={formatJSON}
                disabled={!jsonData.trim() || !!jsonError}
              >
                <Code className="w-4 h-4 mr-2" />
                Format JSON
              </Button>
            </div>
            <Textarea
              ref={textareaRef}
              value={jsonData}
              onChange={(e) => handleJSONChange(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Product JSON will appear here..."
            />
            {jsonError && (
              <p className="text-sm text-destructive">{jsonError}</p>
            )}
            {schemaErrors.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Schema Validation Errors:
                </p>
                {schemaErrors.map((error, index) => (
                  <p key={index} className="text-sm text-destructive ml-2">
                    • {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating || hasErrors || !jsonData.trim()}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
