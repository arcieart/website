import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SelectCustomization } from "@/types/customization";

interface OptionPickerProps {
  customization: SelectCustomization;
  selectedOptionId?: string;
  onOptionChange: (optionId: string | undefined) => void;
}

export function OptionPicker({
  customization,
  selectedOptionId,
  onOptionChange,
}: OptionPickerProps) {
  const selectedOption = selectedOptionId
    ? customization.options.find((option) => option.id === selectedOptionId)
    : undefined;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {customization.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onOptionChange(option.id)}
            className={`relative px-4 py-2 rounded-lg border-2 transition-all hover:scale-105 focus:outline-none text-sm font-medium ${
              selectedOptionId === option.id
                ? "border-primary bg-primary/10 text-primary shadow-lg"
                : "border-border hover:border-primary/50 hover:shadow-md bg-background text-foreground"
            }`}
            aria-label={`Select ${option.label}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
