"use server";

import { assertAdmin } from "@/lib/assert-admin";
import { createPresignedMediaUpload } from "@/lib/aws-s3";

export async function createMediaUploadUrl(input: {
  idToken: string;
  kind: "image" | "video";
  contentType: string;
  productId: string;
}) {
  await assertAdmin(input.idToken);

  return createPresignedMediaUpload({
    kind: input.kind,
    contentType: input.contentType,
    productId: input.productId,
  });
}
