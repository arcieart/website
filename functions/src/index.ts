// https://github.com/robisim74/firebase-functions-typescript-starter/blob/master/functions/src/index.ts

import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { onProductDeletedFunction } from "./onProductDelete";

import dotenv from "dotenv";
dotenv.config();


export const onProductDeleted = onDocumentDeleted("products/{productId}", onProductDeletedFunction);
export const onProductDeletedDev = onDocumentDeleted("dev_products/{productId}", onProductDeletedFunction);
