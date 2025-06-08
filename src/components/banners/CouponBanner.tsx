import { Badge } from "@/components/ui/badge";
import { Tag, Sparkles } from "lucide-react";
import { formatPriceLocalized } from "@/utils/price";
import { getFreeShippingThreshold } from "@/config/currency";

export default function CouponBanner() {
  const freeShippingThreshold = getFreeShippingThreshold();

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/20 p-4">
      <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-primary/20" />
      <div className="absolute -bottom-2 -left-2 h-12 w-12 rounded-full bg-primary/15" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">
            Special Offer!
          </h3>
          <p className="text-xs text-muted-foreground">
            Free shipping on orders over{" "}
            {formatPriceLocalized(freeShippingThreshold)}
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/20 text-primary">
          <Tag className="mr-1 h-3 w-3" />
          FREESHIP50
        </Badge>
      </div>
    </div>
  );
}
