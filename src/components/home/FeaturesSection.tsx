import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, MousePointerClick, Printer, Truck, Zap } from "lucide-react";

const features = [
  {
    icon: MousePointerClick,
    title: "Clickers in stock",
    description:
      "Mechanical fidget clickers printed here, sold as finished products.",
  },
  {
    icon: Printer,
    title: "Custom 3D printing",
    description:
      "Send an STL or 3MF. We quote, print in PLA+ or PETG, and ship.",
  },
  {
    icon: MapPin,
    title: "Byculla, Mumbai",
    description:
      "A real studio in the city, not a marketplace listing with no workshop.",
  },
  {
    icon: Truck,
    title: "Ships across India",
    description:
      "Typical print and finish in 3-5 business days. Free shipping over ₹999.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Why this shop
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A print studio that also sells clickers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="text-center border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
