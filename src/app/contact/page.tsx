import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";
import { Metadata } from "next";
import { ContactForm } from "./ContactUsForm";

export const metadata: Metadata = {
  title: "Arcie Art | Contact Us",
  description: "Reach out to us for any inquiries or collaborations",
  alternates: {
    canonical: "https://myarcieart.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 lg:max-w-6xl md:max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl text-center font-bold mb-8 text-foreground">
            Contact Us
          </h1>
          {/* <div className="md:flex mb-16"> */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="basis-[48%]">
              <p className="md:text-lg text-base font-semibold text-muted-foreground md:text-center lg:text-left my-2">
                Have a question or idea?
                <br />
                We&apos;d love to hear from you.
              </p>
              <p className="md:text-base text-sm text-muted-foreground md:text-center lg:text-left mb-2 ">
                Whether you&apos;re curious about our 3D printed products,
                interested in customizing something special, or need help with
                an order, we&apos;re here to help. We&apos;ll do our best to
                respond within 24 hours during business hours.
              </p>
              {/* Contact Information */}
              <div className="mt-6 lg:block hidden">
                <div className="space-y-8 text-left">
                  <ContactInfo />
                </div>
              </div>
            </div>
            <div className="basis-[60%]">
              <Card>
                <CardContent className="space-y-3 sm:space-y-4">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Contact Information */}
        <div className="lg:hidden block">
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-8 text-left">
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfo() {
  return (
    <>
      <div className="flex items-start space-x-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Phone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-md text-muted-foreground">Phone</h3>
          <a href="tel:+919769910657" className="hover:underline font-medium">
            +91 97699 10657
          </a>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-md text-muted-foreground">Email</h3>
          <a
            href="mailto:myarcieart@gmail.com"
            className="hover:underline font-medium"
          >
            myarcieart@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}
