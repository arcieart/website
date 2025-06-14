import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Users } from "lucide-react";

export default function AboutBrandSection() {
  return (
    <section className="px-4 py-16 md:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Heart className="w-3 h-3 mr-1" />
            Our Story
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            About Arcie Art
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              At Arcie Art, we believe that every person deserves something
              uniquely theirs. Our passion for personalization drives us to
              create custom products that tell your story and express your
              personality.
            </p>

            <p className="leading-relaxed text-muted-foreground">
              Founded with the vision of making personalized art accessible to
              everyone, we combine traditional craftsmanship with modern 3D
              printing technology to bring your ideas to life with precision and
              care.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">
                  Happy Customers
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">
                  Custom Products
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                <p className="text-muted-foreground mb-4">
                  Your satisfaction is our priority. We work closely with each
                  customer to ensure every product exceeds expectations.
                </p>
                <Button variant="outline" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Read Reviews
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
