import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BaseCategoriesObj } from "@/data/categories";
import { Materials } from "@/data/materials";
import { UIProduct } from "@/types/product";
import { Package, ShoppingBag, Truck } from "lucide-react";

export const ProductSpecAccordion = ({ product }: { product: UIProduct }) => {
  return (
    <div>
      <Accordion type="multiple" className="w-full space-y-2">
        {/* Category & Material */}
        <AccordionItem value="category-material" className="pr-4">
          <AccordionTrigger className="text-sm font-medium">
            <span className="flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Dimensions & Material
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Category</span>
              <span className="text-sm font-medium capitalize">
                {BaseCategoriesObj[product.categoryId].name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Material</span>
              <span className="text-sm font-medium capitalize">
                {Materials[product.material].name}
              </span>
            </div>
            {product.weight && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weight</span>
                <span className="text-sm font-medium">{product.weight}g</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Dimensions
                </span>
                <span className="text-sm font-medium">
                  {product.dimensions.split("x").join("×")}
                </span>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Weight and dimensions may vary due to 3D printing process and
              customization.
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Shipping & Handling */}
        <AccordionItem value="shipping" className="pr-4">
          <AccordionTrigger className="text-sm font-medium">
            <span className="flex items-center">
              <Truck className="w-4 h-4 mr-2" />
              Shipping & Handling
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Country of Origin
              </span>
              <span className="text-sm font-medium">India</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Order Processing
              </span>
              <span className="text-sm font-medium">3-5 business days</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Care & Warranty */}
        <AccordionItem value="warranty" className="pr-4">
          <AccordionTrigger className="text-sm font-medium">
            <span className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Return Policy
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Replacement or Return
              </span>
              <span className="text-sm font-medium">Within 7 days</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <ul className="list-disc list-inside space-y-1">
                <li>We do not offer refunds for personalized products.</li>
                <li>
                  We offer a 7-day return policy for unused items in original
                  packaging.
                </li>
                <li>
                  Buyers are responsible for return postage costs. If the item
                  is not returned in its original condition, the buyer is
                  responsible for any loss in value.
                </li>
                <li>
                  If the product is damaged or there are printing errors,
                  contact us through WhatsApp for return assistance.
                </li>
                <li>
                  For any returns / replacement claim, we will require a video
                  showcasing the product being unboxed and defect shown in the
                  video. This is to prevent fraud and misuse of the return
                  policy.
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
