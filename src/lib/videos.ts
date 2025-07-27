// Video compression utility for reducing file sizes before upload
// Note: This is a basic implementation. For production use, consider using FFmpeg.wasm or a server-side solution

export interface VideoCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
}

export async function compressVideo(
  videoFile: File,
  options: VideoCompressionOptions = {
    maxSizeMB: 10,
    maxWidthOrHeight: 1920,
    quality: 0.8,
  }
): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    video.onloadedmetadata = () => {
      // Calculate new dimensions
      const { maxWidthOrHeight = 1920 } = options;
      let { videoWidth, videoHeight } = video;
      
      if (videoWidth > maxWidthOrHeight || videoHeight > maxWidthOrHeight) {
        if (videoWidth > videoHeight) {
          videoHeight = (videoHeight * maxWidthOrHeight) / videoWidth;
          videoWidth = maxWidthOrHeight;
        } else {
          videoWidth = (videoWidth * maxWidthOrHeight) / videoHeight;
          videoHeight = maxWidthOrHeight;
        }
      }

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // For now, we'll just return the original file since browser-based video compression
      // is complex and requires specialized libraries like FFmpeg.wasm
      // In production, consider implementing server-side compression
      resolve(videoFile);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video for compression'));
    };

    // Create object URL for the video
    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;
    video.load();
  });
}

// Helper function to get video duration
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };
    
    video.src = URL.createObjectURL(file);
    video.load();
  });
}

// Helper function to validate video file
export function validateVideoFile(file: File): boolean {
  const validTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/mov',
    'video/wmv'
  ];
  
  return validTypes.includes(file.type);
} 

// Helper function to generate video thumbnail
export const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    video.crossOrigin = "anonymous";
    video.currentTime = 1; // Seek to 1 second to get a good frame

    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      resolve(thumbnailDataUrl);
    };

    video.onerror = () => {
      reject(new Error("Failed to load video"));
    };

    video.src = videoUrl;
    video.load();
  });
};
