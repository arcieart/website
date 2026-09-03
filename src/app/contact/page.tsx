import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/seo/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  PRINT_SERVICE_FAQS,
  SITE_ADDRESS,
  SITE_CONTACT,
  SITE_HOURS,
} from "@/config/site";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import {
  getWhatsappClickerLink,
  getWhatsappPrintQuoteLink,
} from "@/utils/whatsappMessageLinks";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Arcie Art in Byculla, Mumbai for fidget clickers, clicker switches, and custom 3D printing quotes. WhatsApp, email, or phone.",
  path: "/contact",
  keywords: [
    "arcie art contact",
    "3d printing mumbai contact",
    "fidget clicker mumbai",
    "clicker switches mumbai",
    "custom 3d print quote mumbai",
  ],
});

export default function ContactPage() {
  const printQuoteHref = getWhatsappPrintQuoteLink();
  const clickerHref = getWhatsappClickerLink();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <JsonLd data={faqJsonLd(PRINT_SERVICE_FAQS.slice(0, 4))} />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Contact Arcie Art
          </h1>
          <p className="text-md text-muted-foreground max-w-2xl mx-auto">
            Clicker orders and custom 3D printing quotes from Byculla,
            Mumbai. WhatsApp is usually the fastest.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Get in touch</h2>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-md text-muted-foreground">
                  Phone
                </h3>
                <a
                  href={`tel:${SITE_CONTACT.phoneTel}`}
                  className="hover:underline font-medium"
                >
                  {SITE_CONTACT.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-md text-muted-foreground">
                  Email
                </h3>
                <a
                  href={`mailto:${SITE_CONTACT.email}`}
                  className="hover:underline font-medium"
                >
                  {SITE_CONTACT.email}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-md text-muted-foreground">
                  Studio
                </h3>
                <p className="font-medium text-foreground">
                  {SITE_ADDRESS.line}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">What to write</h2>
            <p className="text-sm text-muted-foreground">
              For a custom print, send the 3D file, quantity, and PLA+ or PETG.
              For clickers, say which design and how many.
            </p>
            <a href={printQuoteHref} target="_blank" rel="noopener noreferrer">
              <Button className="w-full mb-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp a print quote
              </Button>
            </a>
            <a href={clickerHref} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full mb-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp clickers
              </Button>
            </a>
            <Link href="/3d-printing">
              <Button variant="ghost" className="w-full">
                Read about 3D printing services
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center bg-muted/30 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-semibold mb-4">Studio hours</h2>
          <div className="grid sm:grid-cols-1 gap-4 max-w-md mx-auto">
            <div>
              <p className="font-medium">{SITE_HOURS.days}</p>
              <p className="text-muted-foreground">{SITE_HOURS.time} IST</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick answers</h2>
          <FaqList items={PRINT_SERVICE_FAQS.slice(0, 4)} />
        </div>
      </div>
    </div>
  );
}
