import { createMediaUploadUrl } from "@/actions/s3";
import { auth } from "@/lib/firebase";

export async function uploadProductMedia(
  file: File,
  kind: "image" | "video",
  productId: string
) {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) {
    throw new Error("Admin session expired. Sign in again.");
  }

  if (!file.type) {
    throw new Error("Unsupported file type");
  }

  const { uploadUrl, publicUrl } = await createMediaUploadUrl({
    idToken,
    kind,
    contentType: file.type,
    productId,
  });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!response.ok) {
    throw new Error(
      kind === "video" ? "Failed to upload video" : "Failed to upload image"
    );
  }

  return publicUrl;
}
