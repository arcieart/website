import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { getFreeShippingThreshold } from "./currency";
import { formatPrice } from "@/utils/price";

export interface OfferTheme {
  background: string;
  textColor: string;
  iconColor: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  badgeClassName?: string;
}

export interface Offer {
  id: string;
  title: React.ReactNode;
  description: React.ReactNode;
  theme: OfferTheme;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  priority: number; // Higher number = higher priority
}

// Predefined themes for different occasions
export const offerThemes = {
  valentine: {
    background:
      "bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-200",
    textColor: "text-pink-900",
    iconColor: "text-pink-600",
    badgeVariant: "secondary" as const,
    badgeClassName: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  },
  diwali: {
    background:
      "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-200",
    textColor: "text-yellow-900",
    iconColor: "text-yellow-600",
    badgeVariant: "secondary" as const,
    badgeClassName: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  holi: {
    background:
      "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 border border-purple-200",
    textColor: "text-purple-900",
    iconColor: "text-purple-600",
    badgeVariant: "secondary" as const,
    badgeClassName: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  },
  christmas: {
    background:
      "bg-gradient-to-r from-green-500/20 to-red-500/20 border border-green-200",
    textColor: "text-green-900",
    iconColor: "text-green-600",
    badgeVariant: "secondary" as const,
    badgeClassName: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  default: {
    background:
      "bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20",
    textColor: "text-foreground",
    iconColor: "text-primary",
    badgeVariant: "secondary" as const,
    badgeClassName: "bg-primary/20 text-primary",
  },
} as const;

// Copy to clipboard function for coupon codes
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`Coupon code "${text}" copied to clipboard!`, {
      description: "You can now paste it at checkout",
    });
  } catch (err) {
    console.error("Failed to copy text: ", err);
    toast.error("Failed to copy coupon code", {
      description: "Please try selecting and copying manually",
    });
  }
};

// Coupon code component with copy functionality
const CouponCode: React.FC<{ code: string; className?: string }> = ({
  code,
  className,
}) => (
  <Badge
    className={`cursor-pointer transition-all hover:scale-105 ${className}`}
    onClick={() => copyToClipboard(code)}
  >
    <Copy className="mr-1 h-3 w-3" />
    {code}
  </Badge>
);

const InlineCouponCode: React.FC<{ code: string; className?: string }> = ({
  code,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className={`font-bold text-primary ${className}`}>
      {code}
      <button onClick={handleCopy} className="mx-1">
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </span>
  );
};

export const offers: Offer[] = [
  {
    id: "standard-offer",
    title: null,
    description: (
      <div className="space-y-1">
        <div className="flex justify-center items-center">
          <span className="text-center">
            Use <InlineCouponCode code="FIVEOFF" /> to get a flat 5% off
            sitewide
          </span>
        </div>
        <div className="flex justify-center items-center text-muted-foreground">
          <span className="text-center">
            Plus, enjoy free shipping on all orders over{" "}
            {formatPrice(getFreeShippingThreshold(), { decimalPlaces: 0 })}
          </span>
        </div>
      </div>
    ),
    theme: offerThemes.default,
    isActive: true,
    priority: 1,
  },
];

// Helper function to get active offers sorted by priority
export const getActiveOffers = (): Offer[] => {
  const now = new Date();
  return offers
    .filter((offer) => {
      if (!offer.isActive) return false;
      if (offer.startDate && now < offer.startDate) return false;
      if (offer.endDate && now > offer.endDate) return false;
      return true;
    })
    .sort((a, b) => b.priority - a.priority);
};

// Helper function to get the highest priority active offer
export const getTopOffer = (): Offer | null => {
  const activeOffers = getActiveOffers();
  return activeOffers.length > 0 ? activeOffers[0] : null;
};
