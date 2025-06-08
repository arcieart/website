import { Currency } from '@/utils/price';

/**
 * Currency configuration for the application
 * Change DEFAULT_CURRENCY to switch the default currency for the entire app
 */
export const CURRENCY_CONFIG = {
  // Default currency for the application
  DEFAULT_CURRENCY: 'INR' as Currency,
  
  // Free shipping threshold (in the default currency)
  FREE_SHIPPING_THRESHOLD: 30,
  
  // Shipping cost (in the default currency)
  SHIPPING_COST: 5.99,
  
  // Tax rate (as a decimal, e.g., 0.08 = 8%)
  TAX_RATE: 0.08,
} as const;

/**
 * Get the default currency for the application
 */
export function getDefaultCurrency(): Currency {
  return CURRENCY_CONFIG.DEFAULT_CURRENCY;
}

/**
 * Get the free shipping threshold in the default currency
 */
export function getFreeShippingThreshold(): number {
  return CURRENCY_CONFIG.FREE_SHIPPING_THRESHOLD;
}

/**
 * Get the shipping cost in the default currency
 */
export function getShippingCost(): number {
  return CURRENCY_CONFIG.SHIPPING_COST;
}

/**
 * Get the tax rate
 */
export function getTaxRate(): number {
  return CURRENCY_CONFIG.TAX_RATE;
} 