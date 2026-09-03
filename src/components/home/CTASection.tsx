import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MousePointerClick, Printer } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="secondary" className="mb-4">
          Arcie Art, Mumbai
        </Badge>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Clickers or a custom print
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Shop finished 3D printed clickers, or send a file for a 3D printing
          job from Byculla.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/clicker-switches">
            <Button size="lg" className="px-8">
              <MousePointerClick className="w-4 h-4" />
              Shop clickers
            </Button>
          </Link>
          <Link href="/3d-printing">
            <Button variant="outline" size="lg" className="px-8">
              <Printer className="w-4 h-4" />
              Get a print quote
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
