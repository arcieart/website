import { getDefaultCurrency } from '@/config/currency';
import { BaseCustomizations, FilamentColors } from "@/data/customizations";
import { UIProduct } from "@/types/product";

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface PriceFormatOptions {
  currency?: Currency;
  locale?: string;
  showSymbol?: boolean;
  decimalPlaces?: number;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

const CURRENCY_LOCALES: Record<Currency, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'en-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
};

/**
 * Formats a price with currency symbol based on country
 * @param price - The price to format
 * @param options - Formatting options
 * @returns Formatted price string
 */
export function formatPrice(
  price: number,
  options: PriceFormatOptions = {}
): string {
  const {
    currency = getDefaultCurrency(), // Use configured default currency
    showSymbol = true,
    decimalPlaces = 2,
  } = options;

  if (typeof price !== 'number' || isNaN(price)) {
    return showSymbol ? `${CURRENCY_SYMBOLS[currency]}0.00` : '0.00';
  }

  const formattedPrice = price.toFixed(decimalPlaces);
  
  if (!showSymbol) {
    return formattedPrice;
  }

  // Use currency symbol with the formatted price
  return `${CURRENCY_SYMBOLS[currency]}${formattedPrice}`;
}

export const getStrikethroughPrice = (price: number) => {
  return price * 1.2;
}

/**
 * Formats a price with localized formatting
 * @param price - The price to format
 * @param options - Formatting options
 * @returns Formatted price string with locale-specific formatting
 */
export function formatPriceLocalized(
  price: number,
  options: PriceFormatOptions = {}
): string {
  const {
    currency = getDefaultCurrency(),
    locale,
    decimalPlaces = 2,
  } = options;

  if (typeof price !== 'number' || isNaN(price)) {
    return new Intl.NumberFormat(locale || CURRENCY_LOCALES[currency], {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(0);
  }

  return new Intl.NumberFormat(locale || CURRENCY_LOCALES[currency], {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(price);
}

/**
 * Gets the currency symbol for a given currency
 * @param currency - The currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: Currency = getDefaultCurrency()): string {
  return CURRENCY_SYMBOLS[currency];
}

/**
 * Calculates the total price for a product with customizations
 * @param basePrice - The base price of the product
 * @param customizations - Object containing customization key-value pairs
 * @param quantity - Quantity of the product (defaults to 1)
 * @returns Total calculated price
 */
export function calculateProductPrice(
  basePrice: number,
  customizations: Record<string, string> = {},
  quantity: number = 1
): number {
  let totalPrice = basePrice;
  
  Object.keys(customizations).forEach((key: string) => {
    const customization = BaseCustomizations[key];
    
    if (customization?.type === "fixed-color-picker") {
      const selectedColor = customizations[key];
      const selectedColorObj = FilamentColors.find(
        (c) => c.id === selectedColor
      );
      if (selectedColorObj) {
        totalPrice += selectedColorObj.priceAdd;
      }
    }
    
    if (customization?.priceAdd) {
      totalPrice += customization.priceAdd;
    }
  });
  
  return totalPrice * quantity;
}

/**
 * Calculates the unit price for a product with customizations (without quantity multiplication)
 * @param basePrice - The base price of the product
 * @param customizations - Object containing customization key-value pairs
 * @returns Unit price with customizations
 */
export function calculateProductUnitPrice(
  basePrice: number,
  customizations: Record<string, string> = {}
): number {
  return calculateProductPrice(basePrice, customizations, 1);
}