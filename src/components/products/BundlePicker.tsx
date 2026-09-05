import { formatPrice } from "@/utils/price";
import { UIProduct } from "@/types/product";

type BundlePickerProps = {
  parent: UIProduct;
  bundles: UIProduct[];
  selectedId: string;
  onSelect: (productId: string) => void;
};

export function BundlePicker({
  parent,
  bundles,
  selectedId,
  onSelect,
}: BundlePickerProps) {
  const options = [parent, ...bundles];

  if (bundles.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Bundle</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const selected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={selected}
              className={`min-w-[7.5rem] rounded-lg border-2 px-4 py-3 text-left transition-all hover:scale-[1.02] focus:outline-none ${
                selected
                  ? "border-primary bg-primary/10 text-primary shadow-lg"
                  : "border-border bg-background text-foreground hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <span className="block text-sm font-medium leading-snug">
                {option.name}
              </span>
              <span
                className={`mt-1 block text-sm ${
                  selected ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {formatPrice(option.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
