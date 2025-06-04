import * as admin from "firebase-admin";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_ADMIN!);

// Check if Firebase admin is already initialized to prevent multiple instances
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const firestore = admin.firestore;
