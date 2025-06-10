import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UIProduct } from "@/types/product";
import { Package } from "lucide-react";

export const ProductSpecAccordion = ({ product }: { product: UIProduct }) => {
  return (
    <div>
      <Accordion type="multiple" className="w-full space-y-2">
        {/* Category & Material */}
        <AccordionItem value="category-material" className="px-4">
          <AccordionTrigger className="text-sm font-medium">
            <span className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Category & Material
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Category</span>
              <span className="text-sm font-medium capitalize">
                {product.categoryId.replace("-", " ")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Material</span>
              <span className="text-sm font-medium">Premium PLA+ Filament</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Finish</span>
              <span className="text-sm font-medium">Matte / Smooth</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dimensions */}
        <AccordionItem value="dimensions" className="px-4">
          <AccordionTrigger className="text-sm font-medium">
            Dimensions & Specifications
          </AccordionTrigger>
          <AccordionContent className="space-y-2 pb-4">
            <div className="text-sm font-medium text-foreground">
              {product.dimensions}
            </div>
            <div className="text-xs text-muted-foreground">
              Measurements may vary ±2mm due to 3D printing process
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Shipping & Handling */}
        <AccordionItem value="shipping" className="px-4">
          <AccordionTrigger className="text-sm font-medium">
            Shipping & Handling
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Processing</span>
              <span className="text-sm font-medium">3-5 business days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Weight</span>
              <span className="text-sm font-medium">{product.weight}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Packaging</span>
              <span className="text-sm font-medium">Eco-friendly</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Care & Warranty */}
        <AccordionItem value="warranty" className="px-4">
          <AccordionTrigger className="text-sm font-medium">
            Care & Warranty
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Warranty</span>
              <span className="text-sm font-medium">30 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Returns</span>
              <span className="text-sm font-medium">14 days</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Clean with dry cloth. Avoid extreme temperatures.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
