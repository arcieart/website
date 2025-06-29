"use client";

import React, { useState } from "react";
import { X, AlertCircle, Gift, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopLayoutBannerProps {
  type?: "info" | "warning" | "success" | "error" | "promotion";
  dismissible?: boolean;
  children: React.ReactNode;
}

const bannerConfig = {
  info: {
    bgColor: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
    icon: Info,
    iconColor: "text-blue-600",
  },
  warning: {
    bgColor: "bg-yellow-50 border-yellow-200",
    textColor: "text-yellow-800",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
  },
  success: {
    bgColor: "bg-green-50 border-green-200",
    textColor: "text-green-800",
    icon: Gift,
    iconColor: "text-green-600",
  },
  error: {
    bgColor: "bg-red-50 border-red-200",
    textColor: "text-red-800",
    icon: AlertCircle,
    iconColor: "text-red-600",
  },
  promotion: {
    bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    textColor: "text-white",
    icon: Gift,
    iconColor: "text-white",
  },
};

export const TopLayoutBanner: React.FC<TopLayoutBannerProps> = ({
  type = "info",
  dismissible = true,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const config = bannerConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "w-full border-b transition-all duration-300 ease-in-out",
        config.bgColor,
        type === "promotion" ? "animate-pulse" : ""
      )}
    >
      <div className="container mx-auto px-4 py-2 relative flex items-center justify-between">
        <div className="flex items-center flex-1 lg:justify-center">
          <div className="flex items-center gap-3">
            <Icon className={cn("h-5 w-5 flex-shrink-0", config.iconColor)} />
            <span
              className={cn(
                "text-sm font-medium leading-relaxed",
                config.textColor
              )}
            >
              {children}
            </span>
          </div>
        </div>
        {dismissible && (
          <button
            onClick={() => setIsVisible(false)}
            className={cn(
              "p-1 rounded-full hover:bg-black/10 transition-colors duration-200",
              config.iconColor
            )}
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const NavBarBanner = () => {
  // return null;

  return (
    <TopLayoutBanner type="warning" dismissible={false}>
      <p>
        Our store will be closed from 24th June to 7th July 2025 on occasion of
        Muharram. Orders placed during this time will be processed on 8th July
        2025
      </p>
    </TopLayoutBanner>
  );
};
