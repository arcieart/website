import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Palette, Zap, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CustomPrintsSection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="outline" className="mb-4">
          <Printer className="w-3 h-3 mr-1" />
          Custom jobs
        </Badge>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Need a print that is not in the shop?
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Send the file. We quote custom 3D printing from Mumbai, then print in
          PLA+ or PETG and ship it.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Palette className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Your design</h3>
              <p className="text-sm text-muted-foreground">
                STL, 3MF, or STEP. Or a sketch if you need us to model it first.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quote first</h3>
              <p className="text-sm text-muted-foreground">
                Price and timing before we start. No surprise invoices after
                the print.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Layers className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">PLA+ or PETG</h3>
              <p className="text-sm text-muted-foreground">
                Pick the material for the job, or ask us which one fits.
              </p>
            </CardContent>
          </Card>
        </div>

        <Link href="/3d-printing">
          <Button size="lg" className="group">
            How custom 3D printing works
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
