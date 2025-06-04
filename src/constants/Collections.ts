import { isProduction } from "@/utils/misc";

enum ProdCollections {
  Products = "products",
  Orders = "orders",
}

enum DevCollections {
  Products = "dev_products",
  Orders = "dev_orders",
}

export const Collections = isProduction ? ProdCollections : DevCollections;