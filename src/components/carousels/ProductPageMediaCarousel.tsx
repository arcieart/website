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
import { Share, Play } from "lucide-react";
import { shareProduct } from "@/utils/share";
import { UIProduct } from "@/types/product";
import { useVideoHandling } from "@/hooks/useVideoHandling";

interface MediaCarouselProps {
  alt: string;
  className?: string;
  product: UIProduct;
  selectedCustomizations?: Record<string, string>; // current customization selections
}

// Helper function to find the best matching image based on current customizations
const findBestMatchingImageIndex = (
  product: UIProduct,
  selectedCustomizations?: Record<string, string>
): number => {
  if (!selectedCustomizations || !product.imageMapping.length) {
    return 0; // Default to first image
  }

  // Create a priority map based on product's customization options order
  const customizationPriorities = product.customizationOptions.reduce(
    (acc, option, index) => {
      // Higher priority (weight) for earlier customizations
      // First customization gets weight 10, second gets 7, third gets 5, etc.
      const weight = Math.max(10 - index * 3, 1);
      acc[option.customizationRefId] = weight;
      return acc;
    },
    {} as Record<string, number>
  );

  // Find the image with the highest weighted score
  let bestMatch = -1; // -1 indicates no meaningful match found
  let maxScore = 0;

  product.imageMapping.forEach((productImage, index) => {
    if (!productImage.customizationMapping) return;

    let score = 0;
    Object.entries(productImage.customizationMapping).forEach(
      ([customizationId, expectedValue]) => {
        if (selectedCustomizations[customizationId] === expectedValue) {
          // Add weighted score based on customization priority
          const weight = customizationPriorities[customizationId] || 1;
          score += weight;
        }
      }
    );

    if (score > maxScore) {
      maxScore = score;
      bestMatch = index;
    }
  });

  // Return -1 if no matches found (maxScore = 0), otherwise return the best match
  return maxScore > 0 ? bestMatch : -1;
};

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

export function ProductPageMediaCarousel({
  alt,
  className,
  product,
  selectedCustomizations,
}: MediaCarouselProps) {
  // Combine images and videos into a single media array with type information
  const mediaItems = [
    ...product.imageMapping.map((img) => ({
      url: img.url,
      type: "image" as const,
    })),
    ...product.videos.map((url) => ({ url, type: "video" as const })),
  ];
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Use custom hook for video handling
  const { videoThumbnails, videoRefs } = useVideoHandling(
    product.videos,
    mediaItems,
    current
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-navigate to best matching image when customizations change
  React.useEffect(() => {
    if (!api || !selectedCustomizations) return;

    const bestMatchIndex = findBestMatchingImageIndex(
      product,
      selectedCustomizations
    );

    // Only navigate if we found a meaningful match (score > 0) and it's different from current
    const currentIndex = api.selectedScrollSnap();
    if (bestMatchIndex !== currentIndex && bestMatchIndex !== -1) {
      api.scrollTo(bestMatchIndex);
    }
  }, [api, selectedCustomizations, product]);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          <Image
            fill
            src="/placeholder-product.jpg"
            alt={alt}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    );
  }

  if (mediaItems.length === 1) {
    const mediaItem = mediaItems[0];
    return (
      <div className={cn("relative space-y-4", className)}>
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          {mediaItem.type === "image" ? (
            <Image
              fill
              priority
              src={mediaItem.url}
              alt={alt}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <video
              ref={(el) => {
                videoRefs.current[0] = el;
              }}
              src={mediaItem.url}
              className="w-full h-full object-cover"
              disablePictureInPicture
              controls
              controlsList="nodownload"
              muted
              loop
            />
          )}
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
            {mediaItems.map((mediaItem, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                  {mediaItem.type === "image" ? (
                    <Image
                      src={mediaItem.url}
                      alt={`${alt} ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  ) : (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={mediaItem.url}
                      className="w-full h-full object-cover"
                      disablePictureInPicture
                      controls
                      controlsList="nodownload"
                      muted
                      loop
                    />
                  )}
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
        {mediaItems.map((mediaItem, index) => (
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
            {mediaItem.type === "image" ? (
              <Image
                width={50}
                height={50}
                src={mediaItem.url}
                alt={`${alt} thumbnail ${index + 1}`}
                className="object-fill"
              />
            ) : (
              <>
                {videoThumbnails[mediaItem.url] ? (
                  <Image
                    width={50}
                    height={50}
                    src={videoThumbnails[mediaItem.url]}
                    alt={`${alt} video thumbnail ${index + 1}`}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-[50px] h-[50px] bg-gray-200 flex items-center justify-center">
                    <Play className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                {/* Static video indicator */}
                <div className="absolute bottom-1 right-1 bg-black/70 rounded-full p-1">
                  <Play className="w-2 h-2 text-white fill-white" />
                </div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
