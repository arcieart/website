import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Printer,
  Palette,
  Zap,
  Award,
  Heart,
  Layers,
  Phone,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function CustomPrintsSection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="outline" className="mb-4">
          <Printer className="w-3 h-3 mr-1" />
          Custom Solutions
        </Badge>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Need Something Special?
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Looking for a unique 3D print that's not in our catalog? We do custom
          3D printing solutions for your specific needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Palette className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Custom Designs</h3>
              <p className="text-sm text-muted-foreground">
                Send us your 3D files or work with us to create something unique
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fast Turnaround</h3>
              <p className="text-sm text-muted-foreground">
                Quick quotes and efficient production for your custom projects
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Layers className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quality Materials</h3>
              <p className="text-sm text-muted-foreground">
                Premium filaments and materials for durable, professional
                results
              </p>
            </CardContent>
          </Card>
        </div>

        <Link href="/contact">
          <Button size="lg" className="group">
            <span className="hidden md:block">
              Reach Out To Create Something Unique Together
            </span>
            <span className="block md:hidden">
              Let's Create Something Unique
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
