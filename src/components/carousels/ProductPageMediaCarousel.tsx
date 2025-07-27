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
  images: string[];
  videos: string[];
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

export function ProductPageMediaCarousel({
  images,
  videos,
  alt,
  className,
  product,
}: MediaCarouselProps) {
  // Combine images and videos into a single media array with type information
  const mediaItems = [
    ...images.map((url) => ({ url, type: "image" as const })),
    ...videos.map((url) => ({ url, type: "video" as const })),
  ];
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Use custom hook for video handling
  const { videoThumbnails, videoRefs } = useVideoHandling(
    videos,
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
