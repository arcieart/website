import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Package, Award, Heart, Zap } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Fully Customizable",
    description:
      "Design your own unique products with our easy customization tools",
  },
  {
    icon: Package,
    title: "Fast Shipping",
    description: "Quick turnaround time with reliable shipping options",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "High-quality materials and precise 3D printing technology",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Each product is carefully crafted with attention to detail",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Makes Us Special
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
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
