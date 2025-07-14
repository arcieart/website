import posthog from "posthog-js";

export const identifyUser = (
    identifier?: string,
    user?: { name?: string; email?: string },
    setOnce?: Record<string, string | number>
  ) => {
    posthog.identify(identifier, {
      name: user?.name,
      email: user?.email,
      $set_once: setOnce,
    });
  };

export const trackProductViewed = (productData: {
  productId: string;
  productName: string;
  categoryId: string;
  price: number;
  slug: string;
  available: boolean;
  isBestSeller: boolean;
}) => {
  posthog.capture("Product Viewed", {
    product_id: productData.productId,
    product_name: productData.productName,
    category_id: productData.categoryId,
    price: productData.price,
    slug: productData.slug,
    available: productData.available,
    is_best_seller: productData.isBestSeller,
  });
};

export const trackAddToCart = (productData: {
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  price: number;
  quantity: number;
  customizations: Record<string, string>;
  totalPrice: number;
}) => {
  posthog.capture("Add to Cart", {
    product_id: productData.productId,
    product_name: productData.productName,
    category: productData.categoryName,
    category_id: productData.categoryId,
    price: productData.price,
    quantity: productData.quantity,
    customizations: productData.customizations,
    total_price: productData.totalPrice,
  });
};

export const trackPurchaseCompleted = (orderData: {
  orderId: string;
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    productName: string;
    categoryId: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }>;
}) => {
  posthog.capture("Purchase Completed", {
    order_id: orderData.orderId,
    total_amount: orderData.totalAmount,
    subtotal: orderData.subtotal,
    shipping_cost: orderData.shippingCost,
    discount_amount: orderData.discountAmount,
    coupon_code: orderData.couponCode,
    payment_method: orderData.paymentMethod,
    items: orderData.items,
  });
};