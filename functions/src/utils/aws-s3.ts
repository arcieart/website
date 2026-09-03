import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

function getS3Config() {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucketName = process.env.S3_BUCKET_NAME;

  if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
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
