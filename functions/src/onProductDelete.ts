import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { deleteObjectFromS3 } from "./utils/aws-s3";

type Event = FirestoreEvent<
  QueryDocumentSnapshot | undefined,
  { productId: string }
>;

type DeletedProduct = {
  imageMapping?: { url?: unknown }[];
  videos?: unknown[];
  images?: unknown[];
};

function mediaUrls(product: DeletedProduct): string[] {
  const urls: string[] = [];

  for (const image of product.imageMapping ?? []) {
    if (typeof image?.url === "string" && image.url) {
      urls.push(image.url);
    }
  }

  for (const video of product.videos ?? []) {
    if (typeof video === "string" && video) {
      urls.push(video);
    }
  }

  // Pre-migration documents stored a plain URL list.
  for (const image of product.images ?? []) {
    if (typeof image === "string" && image) {
      urls.push(image);
    }
  }

  return [...new Set(urls)];
}

export const onProductDeletedFunction = async (event: Event) => {
  const productId = event.params.productId;
  const product = event.data?.data() as DeletedProduct | undefined;

  if (!product) {
    console.log(`product ${productId} had no snapshot data, skipping media delete`);
    return;
  }

  const urls = mediaUrls(product);
  console.log(`removing ${urls.length} media object(s) for product ${productId}`);

  for (const url of urls) {
    await deleteObjectFromS3(url);
    console.log(`deleted ${url}`);
  }
};
