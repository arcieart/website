import "server-only";

import { Collections } from "@/constants/Collections";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const CONTENT_TYPE_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogg",
  "video/quicktime": "mov",
};

const PRODUCT_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

function readEnv(serverName: string, legacyPublicName: string) {
  return process.env[serverName] || process.env[legacyPublicName] || "";
}

function getS3Config() {
  const region = readEnv("AWS_REGION", "NEXT_PUBLIC_AWS_REGION") || "us-east-1";
  const accessKeyId = readEnv(
    "AWS_ACCESS_KEY_ID",
    "NEXT_PUBLIC_AWS_ACCESS_KEY_ID"
  );
  const secretAccessKey = readEnv(
    "AWS_SECRET_ACCESS_KEY",
    "NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY"
  );
  const bucketName = readEnv("S3_BUCKET_NAME", "NEXT_PUBLIC_S3_BUCKET_NAME");

  if (!accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("S3 is not configured");
  }

  return {
    bucketName,
    client: new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
      requestChecksumCalculation: "WHEN_REQUIRED",
    }),
  };
}

function extensionFor(kind: "image" | "video", contentType: string) {
  const extension = CONTENT_TYPE_EXTENSION[contentType];
  const isImage = contentType.startsWith("image/");
  const isVideo = contentType.startsWith("video/");

  if (!extension || (kind === "image" && !isImage) || (kind === "video" && !isVideo)) {
    throw new Error("Unsupported file type");
  }

  return extension;
}

function objectKey(kind: "image" | "video", productId: string, contentType: string) {
  if (!PRODUCT_ID_PATTERN.test(productId)) {
    throw new Error("Invalid product id");
  }

  const extension = extensionFor(kind, contentType);
  const id = nanoid(12);

  if (kind === "video") {
    return `${Collections.Products}/${productId}/videos/${id}.${extension}`;
  }

  return `${Collections.Products}/${productId}/${id}.${extension}`;
}

export function publicS3Url(key: string) {
  const { bucketName } = getS3Config();
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

export async function createPresignedMediaUpload(input: {
  kind: "image" | "video";
  contentType: string;
  productId: string;
}) {
  const key = objectKey(input.kind, input.productId, input.contentType);
  const { bucketName, client } = getS3Config();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: input.contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

  return {
    uploadUrl,
    publicUrl: publicS3Url(key),
    key,
  };
}
