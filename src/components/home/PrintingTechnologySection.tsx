import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Printer } from "lucide-react";

export default function PrintingTechnologySection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Printer className="w-3 h-3 mr-1" />
            Our Technology
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quality 3D Printing
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Reliable 3D Printing Service
            </h3>

            <p className="text-muted-foreground leading-relaxed">
              We use high-quality PLA material to create detailed and durable
              products. Each item is printed with care and attention to detail,
              ensuring consistent quality and a smooth finish that meets your
              expectations.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  01
                </Badge>
                <div>
                  <h4 className="font-semibold mb-1">Design Upload</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload your custom design or choose from our templates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  02
                </Badge>
                <div>
                  <h4 className="font-semibold mb-1">Print Preparation</h4>
                  <p className="text-sm text-muted-foreground">
                    We optimize your design settings for the best print quality
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  03
                </Badge>
                <div>
                  <h4 className="font-semibold mb-1">Careful Printing</h4>
                  <p className="text-sm text-muted-foreground">
                    Layer-by-layer printing with premium PLA material
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  04
                </Badge>
                <div>
                  <h4 className="font-semibold mb-1">Quality Check</h4>
                  <p className="text-sm text-muted-foreground">
                    Careful inspection and finishing before shipping
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
                <h4 className="font-semibold mb-2">Premium PLA Material</h4>
                <p className="text-sm text-muted-foreground">
                  Eco-friendly, biodegradable plastic that's safe for everyday
                  use and produces excellent detail and surface finish
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Printer className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Reliable 3D Printer</h4>
                <p className="text-sm text-muted-foreground">
                  Our well-maintained 3D printer delivers consistent quality and
                  precision for every order, ensuring your products meet our
                  high standards
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
