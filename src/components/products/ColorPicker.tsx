import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Color, ColorPickerCustomization } from "@/types/customization";
import { getColorsBySet, findColorById } from "@/data/customizations";
import { formatPrice } from "@/utils/price";

interface ColorPickerProps {
  customization: ColorPickerCustomization;
  selectedColorId?: string;
  onColorChange: (colorId: string) => void;
}

export function ColorPicker({
  customization,
  selectedColorId,
  onColorChange,
}: ColorPickerProps) {
  const colors = getColorsBySet(customization.colorSet);
  const selectedColorObj = selectedColorId ? findColorById(selectedColorId) : undefined;

  return (
    <div className="space-y-2">
      <TooltipProvider>
        <div className="flex flex-wrap gap-3">
          {colors.filter((color) => color.available).map((color) => (
            <Tooltip key={color.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onColorChange(color.id)}
                  className={`relative w-10 h-10 rounded-full border-1 transition-all hover:scale-110 focus:outline-none ${
                    selectedColorId === color.id
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
          ))}
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
}
