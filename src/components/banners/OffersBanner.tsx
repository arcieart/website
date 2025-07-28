"use client";

import React from "react";
import { getTopOffer, type Offer } from "@/config/offers";
import { cn } from "@/lib/utils";

interface OffersBannerProps {
  className?: string;
  showOnlyTopOffer?: boolean;
}

export default function OffersBanner({
  className,
  showOnlyTopOffer = true,
}: OffersBannerProps) {
  const topOffer = getTopOffer();

  if (!topOffer) {
    return null;
  }

  return <OfferBannerCard offer={topOffer} className={className} />;
}

interface OfferBannerCardProps {
  offer: Offer;
  className?: string;
}

function OfferBannerCard({ offer, className }: OfferBannerCardProps) {
  const { title, description, theme } = offer;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg p-3",
        className
      )}
    >
      {/* Background with theme styling */}
      <div className={cn("absolute inset-0 rounded-lg", theme.background)} />

      {/* Decorative elements */}
      <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-white/20" />
      <div className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full bg-white/10" />

      {/* Content */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <div className={cn("text-sm font-semibold", theme.textColor)}>
            {title}
          </div>
          <div className={cn("text-xs", theme.textColor)}>{description}</div>
        </div>
      </div>
    </div>
  );
}

// Alternative compact version for smaller spaces
function CompactOffersBanner({ className }: { className?: string }) {
  const topOffer = getTopOffer();

  if (!topOffer) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md p-2",
        className
      )}
    >
      <div
        className={cn("absolute inset-0 rounded-md", topOffer.theme.background)}
      />
      <div className="relative flex items-center justify-between gap-2">
        <div
          className={cn(
            "text-xs font-medium truncate",
            topOffer.theme.textColor
          )}
        >
          {topOffer.title}
        </div>
        <div className={cn("text-xs truncate", topOffer.theme.textColor)}>
          {topOffer.description}
        </div>
      </div>
    </div>
  );
}
