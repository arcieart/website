import { DBProduct, UIProduct } from "@/types/product";

export function isBundleProduct(product: {
  parentProductId?: string;
}): boolean {
  return Boolean(product.parentProductId);
}

export function getDiscoverableProducts<T extends { isDiscoverable: boolean }>(
  products: T[]
): T[] {
  return products.filter((product) => product.isDiscoverable);
}

export function getLinkedBundles(
  parent: { bundleIds?: string[] },
  catalog: UIProduct[]
): UIProduct[] {
  if (!parent.bundleIds?.length) return [];
  const byId = new Map(catalog.map((product) => [product.id, product]));
  return parent.bundleIds
    .map((id) => byId.get(id))
    .filter((product): product is UIProduct => Boolean(product?.available));
}

export function joinBundleDescription(
  bundleDescription?: string,
  parentDescription?: string
): string | undefined {
  const bundle = bundleDescription?.trim();
  const parent = parentDescription?.trim();
  if (bundle && parent) return `${bundle}\n\n${parent}`;
  if (bundle) return bundle;
  return parentDescription;
}

export function applyBundleSelection(
  parent: UIProduct,
  bundle: UIProduct | null
): UIProduct {
  if (!bundle) return parent;
  return {
    ...parent,
    id: bundle.id,
    price: bundle.price,
    description: joinBundleDescription(bundle.description, parent.description),
    bundleName: bundle.name,
  };
}

export function isEligibleBundle(
  candidate: Pick<DBProduct, "id" | "bundleIds" | "parentProductId">,
  parentId: string
): boolean {
  if (candidate.id === parentId) return false;
  if (candidate.bundleIds && candidate.bundleIds.length > 0) return false;
  if (
    candidate.parentProductId &&
    candidate.parentProductId !== parentId
  ) {
    return false;
  }
  return true;
}
