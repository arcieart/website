import { UIProduct } from "@/types/product";

const shareMessage = (product: UIProduct, url: string) => {
    return `Hey! Check out this ${product.name} at arcie.art \n${url}`;
  };
  
  export const shareProduct = async (product: UIProduct) => {
    if(!product) throw new Error("Product is required to share");

    const baseUrl = window.location.origin;
    const url = `${baseUrl}/products/${product.categoryId}/${product.slug}`;
  
    try {
      await navigator.share({ title: `Share ${product.name}`, text: shareMessage(product, url) });
    } catch (e) {
      console.error(e);
    }
  };