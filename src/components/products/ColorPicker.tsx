import Image from "next/image";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ColorPickerCustomization } from "@/types/customization";
import { getColorsBySet, findColorById } from "@/data/customizations";
import { formatPrice } from "@/utils/price";

interface ColorSelectedBadgeProps {
  selectedColorId?: string;
  customization: ColorPickerCustomization;
  onColorChange: (colorId: string | undefined) => void;
}

export function ColorSelectedBadge({
  selectedColorId,
  customization,
  onColorChange,
}: ColorSelectedBadgeProps) {
  const selectedColorObj = selectedColorId
    ? findColorById(selectedColorId)
    : undefined;

  if (!selectedColorObj) return null;

  return (
    <TooltipProvider>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-sm">
        <div
          className="w-3 h-3 rounded-full border border-border"
          style={{ backgroundColor: selectedColorObj.value }}
        >
          {selectedColorObj.assetType === "image" && (
            <Image
              src={selectedColorObj.value}
              alt={selectedColorObj.label}
              width={12}
              height={12}
              className="object-cover w-full h-full rounded-full"
            />
          )}
        </div>
        <span className="font-medium text-foreground">
          {selectedColorObj.label}
        </span>
        {selectedColorObj.priceAdd > 0 && (
          <span className="text-xs text-muted-foreground">
            +{formatPrice(selectedColorObj.priceAdd)}
          </span>
        )}
        {!customization.required && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onColorChange(undefined)}
                className="ml-1 p-0.5 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                aria-label="Clear color selection"
              >
                <X className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Clear selection</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

interface ColorPickerProps {
  customization: ColorPickerCustomization;
  selectedColorId?: string;
  onColorChange: (colorId: string | undefined) => void;
}

export function ColorPicker({
  customization,
  selectedColorId,
  onColorChange,
}: ColorPickerProps) {
  const colors = getColorsBySet(customization.colorSet);
  const selectedColorObj = selectedColorId
    ? findColorById(selectedColorId)
    : undefined;

  return (
    <div className="space-y-3">
      <TooltipProvider>
        <div className="flex flex-wrap gap-3">
          {colors
            .filter((color) => color.available)
            .map((color) => (
              <Tooltip key={color.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onColorChange(color.id)}
                    className={`relative w-10 h-10 rounded-full border-1 transition-all hover:scale-110 focus:outline-none ${
                      selectedColorId === color.id
                        ? "shadow-lg border-primary border-3 ring-2 ring-primary/20"
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
                    {selectedColorId === color.id && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{color.label}</p>
                    {color.priceAdd > 0 && (
                      <p className="text-xs">+{formatPrice(color.priceAdd)}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
        </div>

        {/* Show badge below on mobile only if showSelectedBadge is true */}
        {selectedColorObj && (
          <div>
            <ColorSelectedBadge
              selectedColorId={selectedColorId}
              customization={customization}
              onColorChange={onColorChange}
            />
          </div>
        )}
      </TooltipProvider>
    </div>
  );
}
