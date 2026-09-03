import { BaseCategoriesObj } from "@/data/categories";
import { DBProduct, UIProduct } from "@/types/product";

export function toUIProduct(dbProduct: DBProduct): UIProduct | null {
  const category = BaseCategoriesObj[dbProduct.categoryId];
  if (!category) return null;
  const { id: _categoryDocId, ...restBaseCategory } = category;
  return {
    ...restBaseCategory,
    ...dbProduct,
    price: dbProduct.price ?? category.price,
  };
}
