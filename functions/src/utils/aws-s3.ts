import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

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

function extractKeyFromS3Url(url: string): string {
  const urlObj = new URL(url);
  const host = urlObj.hostname;
  const path = urlObj.pathname.replace(/^\/+/, "");

  // https://bucket.s3.amazonaws.com/key
  // https://bucket.s3.region.amazonaws.com/key
  if (host.includes(".s3.") && host.endsWith(".amazonaws.com")) {
    return decodeURIComponent(path);
  }

  // https://s3.amazonaws.com/bucket/key
  // https://s3.region.amazonaws.com/bucket/key
  if (host === "s3.amazonaws.com" || /^s3\.[a-z0-9-]+\.amazonaws\.com$/.test(host)) {
    const pathParts = path.split("/");
    return decodeURIComponent(pathParts.slice(1).join("/"));
  }

  throw new Error("Invalid S3 URL format");
}

async function deleteObject(key: string): Promise<void> {
  const { bucketName, client } = getS3Config();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}

export async function deleteObjectFromS3(urlOrKey: string): Promise<void> {
  const key = urlOrKey.startsWith("http")
    ? extractKeyFromS3Url(urlOrKey)
    : urlOrKey;
  await deleteObject(key);
}
