import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingCart, Package, Phone } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          New Store Launch
        </Badge>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Discover 3D Printed Products
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore our unique collection of custom 3D printed items. From
          functional products to decorative pieces, find the perfect product for
          your needs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg" className="px-8">
              <ShoppingCart className="w-4 h-4" />
              Shop Now
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="px-8">
              <Phone className="w-4 h-4" />
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
