import { Phone, Mail, MapPin } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Arcie Art | Contact Us",
  description: "Reach out to us for any inquiries or collaborations",
  alternates: {
    canonical: "https://myarcieart.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Contact Us
          </h1>
          <p className="text-md text-muted-foreground max-w-2xl mx-auto">
            Reach out to us for any inquiries or collaborations
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-md text-muted-foreground">
                  Phone
                </h3>
                <a
                  href="tel:+919769910657"
                  className="hover:underline font-medium"
                >
                  +91 97699 10657
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-md text-muted-foreground">
                  Email
                </h3>
                <a
                  href="mailto:myarcieart@gmail.com"
                  className="hover:underline font-medium"
                >
                  myarcieart@gmail.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-md text-muted-foreground">
                  Address
                </h3>
                <p className="font-medium text-foreground">Mumbai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="text-center bg-muted/30 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <div>
              <p className="font-medium">Monday - Friday</p>
              <p className="text-muted-foreground">10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
