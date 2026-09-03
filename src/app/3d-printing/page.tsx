import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileBox, MapPin, Printer, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaqList } from "@/components/seo/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  PRINT_SERVICE_FAQS,
  SITE_ADDRESS,
  SITE_CONTACT,
  SITE_HOURS,
} from "@/config/site";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  serviceJsonLd,
} from "@/lib/seo";
import { getWhatsappPrintQuoteLink } from "@/utils/whatsappMessageLinks";

export const metadata: Metadata = pageMetadata({
  title: "3D Printing Services in Mumbai",
  description:
    "Custom 3D printing in Byculla, Mumbai. Send an STL or 3MF, we print in PLA+ or PETG, finish it, and ship across India. 3-5 day typical turnaround.",
  path: "/3d-printing",
  keywords: [
    "3d printing services mumbai",
    "custom 3d printing mumbai",
    "3d printing byculla",
    "STL 3d print india",
    "PLA 3d printing mumbai",
    "PETG 3d printing",
    "small batch 3d printing india",
    "arcie art 3d printing",
  ],
});

const steps = [
  {
    n: "01",
    title: "Send the file",
    body: "STL, 3MF, or STEP, plus quantity, material, and any size notes. WhatsApp is fastest. Email works too.",
  },
  {
    n: "02",
    title: "Get a quote",
    body: "We check whether the part will print cleanly, then send price and timing before anything is printed.",
  },
  {
    n: "03",
    title: "Print and finish",
    body: "FDM prints in PLA+ or PETG. We inspect the part, clean it up, and pack it.",
  },
  {
    n: "04",
    title: "Dispatch",
    body: "Most jobs leave in 3-5 business days. Ships across India. Free shipping over ₹999.",
  },
];

export default function ThreeDPrintingPage() {
  const whatsappHref = getWhatsappPrintQuoteLink();

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={serviceJsonLd()} />
      <JsonLd data={faqJsonLd(PRINT_SERVICE_FAQS)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "3D printing services", path: "/3d-printing" },
        ])}
      />

      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            <Printer className="w-3 h-3 mr-1" />
            Byculla, Mumbai
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
            3D printing services in Mumbai
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl leading-relaxed">
            Arcie Art prints custom parts from your files, plus our own catalog
            of clickers and 3D printed goods. FDM, PLA+ and PETG, from a
            studio in {SITE_ADDRESS.locality}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto group">
                WhatsApp a print quote
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <Link href="/clicker-switches">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Shop clickers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <FileBox className="w-8 h-8 text-primary mb-3" />
              <h2 className="font-semibold mb-2">Your files</h2>
              <p className="text-sm text-muted-foreground">
                Prototypes, replacement parts, small batches, gifts. If it can
                print on FDM, we will tell you.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Printer className="w-8 h-8 text-primary mb-3" />
              <h2 className="font-semibold mb-2">PLA+ and PETG</h2>
              <p className="text-sm text-muted-foreground">
                PLA+ for most products. PETG when the part will see more heat or
                wear. Ask if you are unsure.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Truck className="w-8 h-8 text-primary mb-3" />
              <h2 className="font-semibold mb-2">Ships across India</h2>
              <p className="text-sm text-muted-foreground">
                Dispatch from Mumbai. Free shipping on orders over ₹999.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">How a job runs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step) => (
              <div key={step.n} className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  {step.n}
                </Badge>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Studio details
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We are not a walk-in print cafe with a queue at the door. Jobs
              come in over WhatsApp and email, get quoted, then printed here in
              Byculla.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                {SITE_ADDRESS.line}
              </li>
              <li>
                Email:{" "}
                <a
                  className="text-foreground hover:underline"
                  href={`mailto:${SITE_CONTACT.email}`}
                >
                  {SITE_CONTACT.email}
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  className="text-foreground hover:underline"
                  href={`tel:${SITE_CONTACT.phoneTel}`}
                >
                  {SITE_CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                Hours: {SITE_HOURS.days}, {SITE_HOURS.time} IST
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              3D printing questions
            </h2>
            <FaqList items={PRINT_SERVICE_FAQS} />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Send the file when you are ready
          </h2>
          <p className="text-muted-foreground mb-8">
            WhatsApp is the shortest path to a quote. If you would rather browse
            finished products, start with clickers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <Button size="lg">WhatsApp a quote</Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact details
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
