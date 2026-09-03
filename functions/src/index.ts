import "dotenv/config";
import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { onProductDeletedFunction } from "./onProductDelete";

export const onProductDeleted = onDocumentDeleted(
  "products/{productId}",
  onProductDeletedFunction
);
export const onProductDeletedDev = onDocumentDeleted(
  "dev_products/{productId}",
  onProductDeletedFunction
);
