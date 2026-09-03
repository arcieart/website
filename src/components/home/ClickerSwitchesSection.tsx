import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MousePointerClick, Printer, Truck } from "lucide-react";
import Link from "next/link";

export default function ClickerSwitchesSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <MousePointerClick className="w-3 h-3 mr-1" />
            Product line
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            3D printed clickers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A clicker is a small mechanical fidget. Press it, it clicks,
            press it again. Ours are printed in PLA+ in Byculla and sold as
            finished pieces, not kits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <MousePointerClick className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Mechanical click</h3>
              <p className="text-sm text-muted-foreground">
                Built as a switch you can fidget with at a desk, not a toy that
                rattles itself apart in a week.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Printer className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Printed in Mumbai</h3>
              <p className="text-sm text-muted-foreground">
                Every unit comes off our printers. We check the action before it
                ships.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Truck className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Ships across India</h3>
              <p className="text-sm text-muted-foreground">
                Order from anywhere in the country. Free shipping over ₹999.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Link href="/clicker-switches">
            <Button size="lg" className="group">
              See clickers
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
