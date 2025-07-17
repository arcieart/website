"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FormData,
  FormErrors,
  validateField,
  validateForm,
} from "@/utils/inputValidation";
import { RequiredStar } from "@/components/misc/RequiredStar";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleInputBlur = (field: keyof FormData) => {
    const value = formData[field];
    const error = validateField(field, value || "");

    if (error) {
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldsToValidate: (keyof FormData)[] = [
      "name",
      "email",
      "phone",
      "message",
    ];

    const submitErrors = validateForm(formData, fieldsToValidate);

    const isFormValid = Object.keys(submitErrors).length === 0;

    if (!isFormValid) {
      setFormErrors(submitErrors);
      toast.error("Please fix the errors in the form");
      return;
    }
    setIsSubmitting(true);

    console.log("Message received");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3 sm:space-y-4 mb-5">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="name" className="text-sm gap-1">
            Full Name
            <RequiredStar />
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            className={formErrors.name ? "border-destructive" : ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onBlur={(e) => handleInputBlur("name")}
          />
          {formErrors.name && (
            <p className="text-xs sm:text-sm text-destructive">
              {formErrors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="gap-1 text-sm">
              Email <RequiredStar />
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={(e) => handleInputBlur("email")}
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && (
              <p className="text-xs sm:text-sm text-destructive">
                {formErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="phone" className="gap-1 text-sm">
              Phone <RequiredStar />
            </Label>

            <span className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">+91</span>
              <Input
                id="phone"
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={(e) => handleInputBlur("phone")}
                className={formErrors.phone ? "border-destructive" : ""}
              />
            </span>
            {formErrors.phone && (
              <p className="text-xs sm:text-sm text-destructive">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="message" className="text-sm gap-1">
            Message <RequiredStar />
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            onBlur={(e) => handleInputBlur("message")}
            className={formErrors.message ? "border-destructive" : ""}
            rows={3}
          />
          {formErrors.message && (
            <p className="text-xs sm:text-sm text-destructive">
              {formErrors.message}
            </p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="w-full text-sm sm:text-base"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Message Sent" : "Submit"}
      </Button>
    </form>
  );
}
