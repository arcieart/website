import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PrintingTechnologySection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Printer className="w-3 h-3 mr-1" />
            The studio
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            3D printing from Byculla
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Custom 3D printing in Mumbai
            </h3>

            <p className="text-muted-foreground leading-relaxed">
              We print our catalog and take outside jobs on the same machines.
              PLA+ for most parts. PETG when you need more heat or wear
              resistance. Typical print and finish is 3-5 business days before
              dispatch.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  01
                </Badge>
                <div>
                  <h4 className="font-semibold mb-1">Send a file</h4>
                  <p className="text-sm text-muted-foreground">
                    STL, 3MF, or STEP over WhatsApp or email, with quantity and
                    material
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  02
                </Badge>
                <div>
                  <h4 className="font-semibold mb-1">Slice and set up</h4>
                  <p className="text-sm text-muted-foreground">
                    We check the file, pick PLA+ or PETG settings, and queue it
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  03
                </Badge>
                <div>
                  <h4 className="font-semibold mb-1">Print</h4>
                  <p className="text-sm text-muted-foreground">
                    FDM, layer by layer, on the studio printers in Byculla
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  04
                </Badge>
                <div>
                  <h4 className="font-semibold mb-1">Check and pack</h4>
                  <p className="text-sm text-muted-foreground">
                    Inspect the part, clean it up, then dispatch
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 w-fit mx-auto mb-4">
                  <Badge className="bg-green-500 text-white">PLA</Badge>
                </div>
                <h4 className="font-semibold mb-2">PLA+ and PETG</h4>
                <p className="text-sm text-muted-foreground">
                  PLA+ for most clickers and gifts. PETG when the part needs
                  more heat or wear resistance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Printer className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">FDM printers in-house</h4>
                <p className="text-sm text-muted-foreground">
                  Jobs are printed here in Byculla, not farmed out to a nameless
                  factory listing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/3d-printing">
            <Button size="lg" className="group">
              3D printing services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
