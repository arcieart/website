import { isProduction } from "@/utils/misc";

enum ProdCollections {
  Products = "products",
  Orders = "orders",
  Coupons = "coupons",
}

enum DevCollections {
  Products = "dev_products",
  Orders = "dev_orders",
  Coupons = "dev_coupons",
}


export const Collections = isProduction ? ProdCollections : ProdCollections;
// export const Collections = DevCollections;