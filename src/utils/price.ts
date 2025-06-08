import { getDefaultCurrency } from '@/config/currency';

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