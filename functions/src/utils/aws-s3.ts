import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const BUCKET_NAME =
  process.env.NEXT_PUBLIC_S3_BUCKET_NAME || "your-bucket-name";
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
  requestChecksumCalculation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
  },
});

async function _deleteImageFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete image");
  }
}

function extractKeyFromS3Url(url: string): string {
  try {
    // Handle URLs in format: https://bucket-name.s3.amazonaws.com/key
    // or https://s3.amazonaws.com/bucket-name/key
    const urlObj = new URL(url);

    if (urlObj.hostname.includes(".s3.amazonaws.com")) {
      // Format: https://bucket-name.s3.amazonaws.com/key
      return urlObj.pathname.substring(1); // Remove leading slash
    } else if (urlObj.hostname === "s3.amazonaws.com") {
      // Format: https://s3.amazonaws.com/bucket-name/key
      const pathParts = urlObj.pathname.substring(1).split("/");
      return pathParts.slice(1).join("/"); // Remove bucket name, keep the rest
    }

    throw new Error("Invalid S3 URL format");
  } catch (error) {
    console.error("Error extracting key from S3 URL:", error);
    throw new Error("Failed to extract key from S3 URL");
  }
}

export async function deleteImageFromS3(urlOrKey: string): Promise<void> {
  try {
    // Check if it's a URL or already a key
    const key = urlOrKey.startsWith("http")
      ? extractKeyFromS3Url(urlOrKey)
      : urlOrKey;
    await _deleteImageFromS3(key);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete image");
  }
}
