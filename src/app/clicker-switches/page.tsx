import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MousePointerClick, Printer, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { FaqList } from "@/components/seo/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { CLICKER_FAQS, CLICKER_KEYWORDS, SITE_ADDRESS } from "@/config/site";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
  pageMetadata,
} from "@/lib/seo";
import { getAvailableProducts } from "@/lib/products";
import { getDiscoverableProducts } from "@/lib/product-bundles";
import { getWhatsappClickerLink } from "@/utils/whatsappMessageLinks";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Fidget Clickers & Switches to Buy in India",
  description:
    "3D printed fidget clickers, clicker switches, and clicky desk toys from Arcie Art in Mumbai. Tactile PLA+ fidgets with a satisfying click. Made in India, shipped nationwide.",
  path: "/clicker-switches",
  keywords: CLICKER_KEYWORDS,
});

export default async function ClickerSwitchesPage() {
  let clickers: Awaited<ReturnType<typeof getAvailableProducts>> = [];
  try {
    const products = getDiscoverableProducts(await getAvailableProducts());
    clickers = products.filter((product) => product.categoryId === "clickers");
  } catch {
    clickers = [];
  }

  const whatsappHref = getWhatsappClickerLink();

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd(CLICKER_FAQS)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Clickers", path: "/clicker-switches" },
        ])}
      />
      {clickers.length > 0 && (
        <JsonLd
          data={itemListJsonLd({
            name: "3D printed fidget clickers and switches",
            path: "/clicker-switches",
            products: clickers,
          })}
        />
      )}

      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            <MousePointerClick className="w-3 h-3 mr-1" />
            3D printed in Mumbai
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
            3D printed clickers
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl leading-relaxed">
            Mechanical fidget clickers, printed in PLA+ at our studio in{" "}
            {SITE_ADDRESS.locality}. Finished pieces, not kits. Ships across
            India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products/clickers">
              <Button size="lg" className="w-full sm:w-auto group">
                Shop clickers
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Order on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <MousePointerClick className="w-8 h-8 text-primary mb-3" />
              <h2 className="font-semibold mb-2">A real click</h2>
              <p className="text-sm text-muted-foreground">
                Press, click, repeat. These are mechanical clickers, not
                silent sliders.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Printer className="w-8 h-8 text-primary mb-3" />
              <h2 className="font-semibold mb-2">Printed here</h2>
              <p className="text-sm text-muted-foreground">
                Every unit comes off our printers in Byculla. We check the
                action before it leaves.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Truck className="w-8 h-8 text-primary mb-3" />
              <h2 className="font-semibold mb-2">Ships nationwide</h2>
              <p className="text-sm text-muted-foreground">
                Order from anywhere in India. Free shipping over ₹999.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                In the shop
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Current clickers. If a design is missing, WhatsApp us.
                Custom colors and one-off shells are often possible.
              </p>
            </div>
            <Link href="/products/clickers">
              <Button variant="outline">
                Full clicker catalog
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {clickers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {clickers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  New clickers are being listed. WhatsApp the studio for
                  what is in stock today, or browse the rest of the 3D printed
                  catalog.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>Ask on WhatsApp</Button>
                  </a>
                  <Link href="/products">
                    <Button variant="outline">Browse products</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Clicker questions
          </h2>
          <FaqList items={CLICKER_FAQS} />
          <p className="mt-8 text-sm text-muted-foreground">
            Want a custom 3D print that is not a clicker? See{" "}
            <Link href="/3d-printing" className="text-foreground underline">
              3D printing services in Mumbai
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
