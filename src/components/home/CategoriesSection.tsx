import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BaseCategories } from "@/data/categories";
import { Package, Palette, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CategoriesSection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Palette className="w-3 h-3 mr-1" />
            Product Categories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From functional accessories to decorative art pieces, find the
            perfect personalized product for any occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BaseCategories.map((category) => (
            <Card
              key={category.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {category.baseDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/products/${category.id}`}>
                  <Button variant="outline" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    View {category.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
