import { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "./firebase-admin";

const FALLBACK_ADMIN_EMAIL = "myarcieart@gmail.com";

export async function assertAdmin(idToken: string): Promise<DecodedIdToken> {
  if (!idToken) {
    throw new Error("Unauthorized");
  }

  let decoded: DecodedIdToken;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    throw new Error("Unauthorized");
  }

  const allowedUid = process.env.ADMIN_UID;
  const allowedEmail = process.env.ADMIN_EMAIL ?? FALLBACK_ADMIN_EMAIL;
  const isAdmin = allowedUid
    ? decoded.uid === allowedUid
    : decoded.email === allowedEmail;

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  return decoded;
}
