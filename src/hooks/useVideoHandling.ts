import { generateVideoThumbnail } from "@/lib/videos";
import { useEffect, useRef, useState } from "react";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

export function useVideoHandling(videos: string[], mediaItems: MediaItem[], current: number) {
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Generate thumbnails for videos
  useEffect(() => {
    const generateThumbnails = async () => {
      const thumbnails: Record<string, string> = {};

      for (const video of videos) {
        try {
          const thumbnail = await generateVideoThumbnail(video);
          thumbnails[video] = thumbnail;
        } catch (error) {
          console.warn("Failed to generate thumbnail for video:", video, error);
          // You could set a fallback thumbnail here if needed
        }
      }

      setVideoThumbnails(thumbnails);
    };

    if (videos.length > 0) {
      generateThumbnails();
    }
  }, [videos]);

  // Pause all videos when carousel selection changes and auto-play current video
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === current - 1) {
          // Auto-play the currently visible video
          const currentMediaItem = mediaItems[index];
          if (currentMediaItem?.type === "video") {
            video.play().catch(() => {
              // Handle autoplay restrictions - video will need user interaction
            });
          }
        } else {
          // Pause all other videos
          video.pause();
        }
      }
    });
  }, [current, mediaItems]);

  // Cleanup: pause all videos when component unmounts
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
    };
  }, []);

  return {
    videoThumbnails,
    videoRefs,
  };
} 