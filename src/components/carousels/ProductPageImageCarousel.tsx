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
import { Share } from "lucide-react";
import { shareProduct } from "@/utils/share";
import { UIProduct } from "@/types/product";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  product: UIProduct;
}

const ShareButton = ({ product }: { product: UIProduct }) => {
  return (
    <div className="absolute top-2 right-2">
      <button
        onClick={() => shareProduct(product)}
        className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full p-2 hover:bg-accent hover:text-accent-foreground transition-all"
      >
        <Share className="w-4 h-4" />
      </button>
    </div>
  );
};

export function ProductPageImageCarousel({
  images,
  alt,
  className,
  product,
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
      <div className={cn("relative space-y-4", className)}>
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          <Image
            fill
            priority
            src={images[0]}
            alt={alt}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <ShareButton product={product} />
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
            <ShareButton product={product} />
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
