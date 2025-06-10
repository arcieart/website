import { Badge } from "../ui/badge";
import { BaseCustomizations, FilamentColors } from "@/data/customizations";

export const CustomizationBadge = ({
  customizationId,
  value,
}: {
  customizationId: string;
  value: string;
}) => {
  const customization = BaseCustomizations[customizationId];
  if (!customization) return null;

  let displayValue = "";
  if (customization.type === "fixed-color-picker") {
    const color = FilamentColors.find((c) => c.id === value);
    if (color) displayValue = color.label;
  }
  if (customization.type === "select") {
    const option = customization.options.find((o) => o.id === value);
    if (option) displayValue = option.label;
  }
  if (customization.type === "checkbox") {
    displayValue = value;
  }
  if (customization.type === "image") {
    displayValue = value;
  }
  if (customization.type === "input") {
    displayValue = value;
  }

  return (
    <Badge variant="secondary" className="text-xs px-1 sm:px-1.5 py-0.5">
      <span className="text-muted-foreground font-medium text-[10px]">
        {customization.afterSelectionLabel}:
      </span>
      <span className="text-foreground font-medium text-[10px]">
        {displayValue}
      </span>
    </Badge>
  );
};
