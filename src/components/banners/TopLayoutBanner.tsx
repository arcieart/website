"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  AlertCircle,
  ArrowRight,
  Gift,
  Info,
  AlertTriangle,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/price";
import { getFreeShippingThreshold } from "@/config/currency";

export interface BannerMessage {
  /** Icon shown with this message. Falls back to the banner type's icon. */
  icon?: LucideIcon;
  text: React.ReactNode;
}

interface TopLayoutBannerProps {
  type?: "info" | "warning" | "success" | "error" | "promotion";
  dismissible?: boolean;
  messages?: BannerMessage[];
  intervalMs?: number;
  cta?: { label: string; href: string };
  children?: React.ReactNode;
}

interface BannerStyle {
  /** Bar background, light and dark. */
  bar: string;
  text: string;
  icon: string;
  /** Dot separating the message from the call to action. */
  divider: string;
  defaultIcon: LucideIcon;
}

const bannerConfig: Record<
  NonNullable<TopLayoutBannerProps["type"]>,
  BannerStyle
> = {
  info: {
    bar: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-900 dark:text-blue-100",
    icon: "text-blue-600 dark:text-blue-300",
    divider: "bg-blue-900/40 dark:bg-blue-100/40",
    defaultIcon: Info,
  },
  warning: {
    bar: "bg-yellow-50 dark:bg-yellow-950",
    text: "text-yellow-900 dark:text-yellow-100",
    icon: "text-yellow-600 dark:text-yellow-300",
    divider: "bg-yellow-900/40 dark:bg-yellow-100/40",
    defaultIcon: AlertTriangle,
  },
  success: {
    bar: "bg-green-50 dark:bg-green-950",
    text: "text-green-900 dark:text-green-100",
    icon: "text-green-600 dark:text-green-300",
    divider: "bg-green-900/40 dark:bg-green-100/40",
    defaultIcon: Gift,
  },
  error: {
    bar: "bg-red-50 dark:bg-red-950",
    text: "text-red-900 dark:text-red-100",
    icon: "text-red-600 dark:text-red-300",
    divider: "bg-red-900/40 dark:bg-red-100/40",
    defaultIcon: AlertCircle,
  },
  // Brand amber gradient in light mode; the bar inverts to warm ink in dark
  // mode so it doesn't glare across the top of a dark screen.
  promotion: {
    bar: cn(
      "bg-[image:var(--primary-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
      "dark:bg-none dark:bg-[#1a1206] dark:shadow-none"
    ),
    text: "text-[#3b2609] dark:text-[#e8dcc6]",
    icon: "text-[#3b2609] dark:text-[#fcae1e]",
    divider: "bg-[#3b2609]/40 dark:bg-[#fcae1e]/45",
    defaultIcon: Gift,
  },
};

const SLIDE_CLASS =
  "flex items-center gap-2 sm:gap-2.5 text-xs sm:text-[13px] font-medium leading-none";

function BannerSlide({
  message,
  style,
}: {
  message: BannerMessage;
  style: BannerStyle;
}) {
  const Icon = message.icon ?? style.defaultIcon;

  return (
    <div className={SLIDE_CLASS}>
      <Icon className={cn("size-[15px] shrink-0", style.icon)} />
      <span className="whitespace-nowrap">{message.text}</span>
    </div>
  );
}

function slideMotionClass(isCurrent: boolean, isPrev: boolean) {
  if (isCurrent) {
    return "translate-y-0 opacity-100";
  }
  if (isPrev) {
    return "-translate-y-full opacity-0 motion-reduce:translate-y-0";
  }
  return "translate-y-full opacity-0 motion-reduce:translate-y-0";
}

function BannerSlideshow({
  slides,
  index,
  style,
}: {
  slides: BannerMessage[];
  index: number;
  style: BannerStyle;
}) {
  if (slides.length === 1) {
    return <BannerSlide message={slides[0]} style={style} />;
  }

  const prev = (index - 1 + slides.length) % slides.length;

  return (
    <div className="relative min-w-0 overflow-hidden">
      {/* Reserves the width of the widest message so nothing beside it shifts. */}
      <div className="invisible grid" aria-hidden="true">
        {slides.map((slide, i) => (
          <div key={`size-${i}`} className="col-start-1 row-start-1">
            <BannerSlide message={slide} style={style} />
          </div>
        ))}
      </div>
      {slides.map((slide, i) => {
        const isCurrent = i === index;
        const isPrev = i === prev;

        return (
          <div
            key={`slide-${i}`}
            {...(!isCurrent ? { "aria-hidden": true as const } : {})}
            className={cn(
              "absolute inset-0 flex justify-center",
              isCurrent || isPrev
                ? "transition-[transform,opacity] duration-500 ease-in-out motion-reduce:transition-none"
                : "transition-none",
              slideMotionClass(isCurrent, isPrev)
            )}
          >
            <BannerSlide message={slide} style={style} />
          </div>
        );
      })}
    </div>
  );
}

export const TopLayoutBanner: React.FC<TopLayoutBannerProps> = ({
  type = "info",
  dismissible = true,
  messages,
  intervalMs = 4500,
  cta,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides: BannerMessage[] = messages?.length
    ? messages
    : children != null
      ? [{ text: children }]
      : [];

  const slideCount = slides.length;
  const rotates = slideCount > 1;

  useEffect(() => {
    if (!rotates || paused) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % slideCount);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [rotates, slideCount, intervalMs, paused]);

  if (!isVisible || slideCount === 0) return null;

  const style = bannerConfig[type];

  return (
    <div
      className={cn("relative w-full", style.bar, style.text)}
      role="region"
      aria-label="Site announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 sm:h-10 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5">
          <BannerSlideshow slides={slides} index={index} style={style} />
          {cta && (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "hidden size-[3px] shrink-0 rounded-full sm:block",
                  style.divider
                )}
              />
              <Link
                href={cta.href}
                className={cn(
                  "hidden shrink-0 items-center gap-1 text-[13px] font-semibold leading-none sm:flex",
                  "underline decoration-1 underline-offset-[3px]",
                  "[text-decoration-color:color-mix(in_srgb,currentColor_40%,transparent)]",
                  "transition-[text-decoration-color] hover:[text-decoration-color:currentColor]"
                )}
              >
                {cta.label}
                <ArrowRight className="size-[13px]" strokeWidth={2.5} />
              </Link>
            </>
          )}
        </div>
      </div>

      {dismissible && (
        <button
          onClick={() => setIsVisible(false)}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 sm:right-4 lg:right-6",
            "transition-colors duration-200 hover:bg-black/10 dark:hover:bg-white/10",
            style.icon
          )}
          aria-label="Dismiss banner"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};

const FREE_SHIPPING_THRESHOLD_LABEL = formatPrice(getFreeShippingThreshold(), {
  decimalPlaces: 0,
});

export const NavBarBanner = () => {
  return (
    <TopLayoutBanner
      type="promotion"
      dismissible={false}
      messages={[
        {
          icon: Gift,
          text: (
            <span>
              <strong className="font-bold dark:text-[#fcae1e]">20% off everything</strong>{" — no coupon needed"}
            </span>
          ),
        },
        {
          icon: Truck,
          text: (
            <span>
              <strong className="font-bold dark:text-[#fcae1e]">Free shipping</strong>{` on orders over ${FREE_SHIPPING_THRESHOLD_LABEL}`}
            </span>
          ),
        },
      ]}
    />
  );
};
