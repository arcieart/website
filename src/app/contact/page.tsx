import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredStar } from "@/components/ui/required-star";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { Metadata } from "next";

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-8 text-foreground">
            Contact Us
          </h1>
          {/* <div className="md:flex mb-16"> */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="basis-[48%]">
              <p className="md:text-lg text-sm font-bold text-muted-foreground md:text-center lg:text-left my-2">
                Have a question or idea?
                <br />
                We&apos;d love to hear from you.
              </p>
              <p className="md:text-lg text-sm text-muted-foreground md:text-center lg:text-left mb-2 ">
                Whether you&apos;re curious about our 3D printed products, interested
                in customizing something special, or need help with an order,
                we&apos;re here to help.
              </p>
              <p className="md:text-lg text-sm text-muted-foreground md:text-center lg:text-left mb-2">
                Reach out to us using the form, or connect directly by phone or
                email. We&apos;ll do our best to respond within 24 hours during
                business hours.
              </p>
            </div>
            <div className="basis-[60%]">
              <Card>
                <CardContent className="space-y-3 sm:space-y-4">
                  <form>
                    <div className="space-y-3 sm:space-y-4 mb-5">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="name" className="text-sm gap-1">
                          Full Name
                          <RequiredStar />
                        </Label>
                        <Input id="name" type="text" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="email" className="gap-1 text-sm">
                            Email <RequiredStar />
                          </Label>
                          <Input id="email" type="email" />
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="phone" className="gap-1 text-sm">
                            Phone <RequiredStar />
                          </Label>

                          <span className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              +91
                            </span>
                            <Input id="phone" type="tel" />
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="order" className="text-sm gap-1">
                          Order Number
                        </Label>
                        <Input id="order" type="text" />
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="address" className="text-sm gap-1">
                          Message <RequiredStar />
                        </Label>
                        <Textarea id="address" rows={3} />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full text-sm sm:text-base"
                      size="lg"
                    >
                      Submit
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Details */}
          <div className="space-y-8">
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
          </div>
        </div>

        {/* Business Hours */}
        <div className="text-center bg-muted/30 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
          <div className="grid gap-4 max-w-md mx-auto">
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
