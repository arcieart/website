"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ProductPageImageCarousel({
  images,
  alt,
  className,
}: ImageCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          <Image
            src="/placeholder-product.jpg"
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          <Image
            src={images[0]}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Carousel */}
      <div className="relative">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <span className="hidden md:block">
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </span>
        </Carousel>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-2 flex-wrap">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={cn(
              "aspect-square relative bg-muted rounded-lg overflow-hidden border-2 transition-all",
              current === index + 1
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-border"
            )}
          >
            <Image
              width={50}
              height={50}
              src={image}
              alt={`${alt} thumbnail ${index + 1}`}
              className="object-fill"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
