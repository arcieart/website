import posthog from "posthog-js";
import { UIProduct } from "@/types/product";
import { CartItem } from "@/stores/cart";
import { Order } from "@/types/order";
import { Coupon } from "@/types/coupon";

// User identification
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

// E-commerce Events
export const trackProductViewed = (product: UIProduct, source?: string) => {
  posthog.capture("Product Viewed", {
    product_id: product.id,
    product_name: product.name,
    category: product.categoryId,
    price: product.price,
    is_best_seller: product.isBestSeller,
    is_available: product.available,
    source: source || "unknown",
    customization_options: product.customizationOptions?.length || 0,
  });
};

export const trackAddToCart = (product: UIProduct, customizations: Record<string, string>, quantity: number = 1) => {
  posthog.capture("Add to Cart", {
    product_id: product.id,
    product_name: product.name,
    category: product.categoryId,
    price: product.price,
    quantity: quantity,
    customizations: customizations,
    customization_count: Object.keys(customizations).length,
  });
};

export const trackRemoveFromCart = (item: CartItem) => {
  posthog.capture("Remove from Cart", {
    product_id: item.product.id,
    product_name: item.product.name,
    category: item.product.categoryId,
    price: item.product.price,
    quantity: item.quantity,
    total_price: item.totalPrice,
    customizations: item.customizations,
  });
};

export const trackCartUpdated = (item: CartItem, oldQuantity: number, newQuantity: number) => {
  posthog.capture("Cart Updated", {
    product_id: item.product.id,
    product_name: item.product.name,
    category: item.product.categoryId,
    old_quantity: oldQuantity,
    new_quantity: newQuantity,
    quantity_change: newQuantity - oldQuantity,
    total_price: item.totalPrice,
  });
};

export const trackCheckoutStarted = (items: CartItem[], totalValue: number, totalItems: number) => {
  posthog.capture("Checkout Started", {
    cart_total: totalValue,
    cart_items: totalItems,
    products: items.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      category: item.product.categoryId,
      price: item.product.price,
      quantity: item.quantity,
      total_price: item.totalPrice,
    })),
  });
};

export const trackOrderPlaced = (order: Order) => {
  posthog.capture("Order Placed", {
    order_id: order.id,
    total_value: order.pricing.total,
    subtotal: order.pricing.subtotal,
    shipping: order.pricing.shipping,
    tax: order.pricing.tax,
    discount: order.pricing.discount || 0,
    coupon_code: order.pricing.couponCode,
    payment_method: order.payment.method,
    total_items: order.products.reduce((sum, p) => sum + p.quantity, 0),
    unique_products: order.products.length,
    customer_email: order.customerInfo.email,
    customer_city: order.customerInfo.city,
    customer_state: order.customerInfo.state,
    source: order.source,
    products: order.products.map(product => ({
      product_id: product.productId,
      product_name: product.name,
      category: product.categoryId,
      price: product.price,
      quantity: product.quantity,
      total_price: product.total,
      customizations: product.customizations,
    })),
  });
};

export const trackOrderCompleted = (order: Order, paymentId?: string) => {
  posthog.capture("Order Completed", {
    order_id: order.id,
    total_value: order.pricing.total,
    payment_id: paymentId,
    total_items: order.products.reduce((sum, p) => sum + p.quantity, 0),
    customer_email: order.customerInfo.email,
  });
};

export const trackPaymentFailed = (orderId: string, reason?: string) => {
  posthog.capture("Payment Failed", {
    order_id: orderId,
    failure_reason: reason || "unknown",
  });
};

export const trackPaymentCancelled = (orderId: string) => {
  posthog.capture("Payment Cancelled", {
    order_id: orderId,
  });
};

// Coupon Events
export const trackCouponApplied = (coupon: Coupon, cartTotal: number, discountAmount: number) => {
  posthog.capture("Coupon Applied", {
    coupon_code: coupon.code,
    coupon_name: coupon.name,
    discount_type: coupon.discountType,
    discount_value: coupon.discountValue,
    discount_amount: discountAmount,
    cart_total: cartTotal,
    min_order_amount: coupon.minOrderAmount,
  });
};

export const trackCouponRemoved = (couponCode: string, reason?: string) => {
  posthog.capture("Coupon Removed", {
    coupon_code: couponCode,
    removal_reason: reason || "manual",
  });
};

export const trackCouponFailed = (couponCode: string, error: string, cartTotal: number) => {
  posthog.capture("Coupon Failed", {
    coupon_code: couponCode,
    error_message: error,
    cart_total: cartTotal,
  });
};

// Product Discovery Events
export const trackCategoryViewed = (categoryId: string, categoryName: string, productCount?: number) => {
  posthog.capture("Category Viewed", {
    category_id: categoryId,
    category_name: categoryName,
    product_count: productCount,
  });
};

export const trackProductsFiltered = (filterType: string, filterValue: string | boolean, resultCount: number) => {
  posthog.capture("Products Filtered", {
    filter_type: filterType,
    filter_value: filterValue,
    result_count: resultCount,
  });
};

export const trackProductsSorted = (sortBy: string, resultCount: number) => {
  posthog.capture("Products Sorted", {
    sort_by: sortBy,
    result_count: resultCount,
  });
};

export const trackSearchPerformed = (query: string, resultCount: number, source?: string) => {
  posthog.capture("Search Performed", {
    search_query: query,
    result_count: resultCount,
    source: source || "unknown",
  });
};

// Wishlist/Favorites Events
export const trackFavoriteAdded = (product: UIProduct, source?: string) => {
  posthog.capture("Favorite Added", {
    product_id: product.id,
    product_name: product.name,
    category: product.categoryId,
    price: product.price,
    source: source || "unknown",
  });
};

export const trackFavoriteRemoved = (productId: string, source?: string) => {
  posthog.capture("Favorite Removed", {
    product_id: productId,
    source: source || "unknown",
  });
};

// Product Customization Events
export const trackCustomizationChanged = (productId: string, customizationType: string, value: string, priceImpact?: number) => {
  posthog.capture("Customization Changed", {
    product_id: productId,
    customization_type: customizationType,
    customization_value: value,
    price_impact: priceImpact || 0,
  });
};

// Navigation and Engagement Events
export const trackCTAClicked = (ctaName: string, location: string, destination?: string) => {
  posthog.capture("CTA Clicked", {
    cta_name: ctaName,
    location: location,
    destination: destination,
  });
};

export const trackContactAttempt = (method: string, source?: string) => {
  posthog.capture("Contact Attempt", {
    contact_method: method, // email, phone, whatsapp
    source: source || "unknown",
  });
};

export const trackThemeChanged = (theme: string) => {
  posthog.capture("Theme Changed", {
    theme: theme,
  });
};

export const trackCartSheetOpened = (source?: string) => {
  posthog.capture("Cart Sheet Opened", {
    source: source || "unknown",
  });
};

export const trackCartSheetClosed = (source?: string) => {
  posthog.capture("Cart Sheet Closed", {
    source: source || "unknown",
  });
};

// Admin Events
export const trackAdminAction = (action: string, resource: string, resourceId?: string) => {
  posthog.capture("Admin Action", {
    action: action,
    resource: resource,
    resource_id: resourceId,
  });
};

// Error Tracking
export const trackError = (errorType: string, errorMessage: string, context?: Record<string, any>) => {
  posthog.capture("Error Occurred", {
    error_type: errorType,
    error_message: errorMessage,
    context: context,
  });
};

// Page View Tracking (supplement to auto-capture)
export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  posthog.capture("Page Viewed", {
    page_name: pageName,
    ...properties,
  });
};
