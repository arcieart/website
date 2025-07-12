import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-6xl mx-auto text-center">
        <Badge variant="secondary" className="mb-4 text-sm font-medium">
          <Sparkles className="w-3 h-3 mr-1" />
          Personalized Products & 3D Printing
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Create Something{" "}
          <span className="pr-2 font-caveat bg-gradient-to-r from-[#fcae1e] to-[#ff8d01] bg-clip-text text-transparent">
            Unique
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Your one-stop shop for unique decor and personalized products. Bring
          your ideas to life with our custom 3D printing services.
        </p>

        <div className="flex justify-center">
          <Link href="/products">
            <Button size="lg" className="w-full sm:w-auto group">
              Browse Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
