import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MousePointerClick, Printer, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-6xl mx-auto text-center">
        <Badge variant="secondary" className="mb-4 text-sm font-medium">
          <Printer className="w-3 h-3 mr-1" />
          Byculla, Mumbai
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Clickers.{" "}
          <span className="pr-2 font-caveat bg-gradient-to-r from-[#fcae1e] to-[#ff8d01] bg-clip-text text-transparent">
            Custom 3D printing.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Mechanical fidget clickers you can order today, and a 3D printing
          studio that takes custom jobs. PLA+ and PETG. Ships across India.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/clicker-switches">
            <Button size="lg" className="w-full sm:w-auto group">
              <MousePointerClick className="w-4 h-4" />
              Shop clickers
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/3d-printing">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Printer className="w-4 h-4" />
              3D printing services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
