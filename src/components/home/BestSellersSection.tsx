import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Award } from "lucide-react";

const bestSellerProducts = [
  {
    id: 1,
    name: "Custom Photo Lithophane",
    description: "Transform your memories into beautiful light art",
    price: 150,
    image: "/placeholder-lithophane.jpg",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Personalized Keychain",
    description: "Unique keychains with your custom design",
    price: 150,
    image: "/placeholder-keychain.jpg",
    badge: "Popular",
  },
  {
    id: 3,
    name: "Custom Earrings",
    description: "Lightweight and stylish personalized earrings",
    price: 150,
    image: "/placeholder-earrings.jpg",
    badge: "Trending",
  },
];

export default function BestSellersSection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Award className="w-3 h-3 mr-1" />
            Customer Favorites
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Best Sellers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular personalized products loved by customers
            worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellerProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md flex flex-col justify-between"
            >
              <CardHeader className="pb-4">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2"
                  >
                    {product.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">₹{product.price}</span>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
