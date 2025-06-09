import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { deleteImageFromS3 } from "./utils/aws-s3";

type Event = FirestoreEvent<
  QueryDocumentSnapshot | undefined,
  { productId: string }
>;

export const onProductDeletedFunction = async (event: Event) => {
  const productId = event.params.productId;
  const product = event.data?.data();
  console.log(`starting to remove product ${productId} images`);

  if (product && product.images) {
    // delete all images from S3
    const images = product.images;
    for (const image of images) {
      await deleteImageFromS3(image);
      console.log(`Image ${image} deleted`);
    }

    // delete the product
    console.log(`product ${productId} images deleted`);
  }
};
