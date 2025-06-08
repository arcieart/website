# Price Utility Functions

This module provides utility functions for formatting prices with different currencies and locales.

## Features

- ✅ Support for multiple currencies (INR, USD, EUR, GBP, JPY)
- ✅ Configurable default currency (set to INR)
- ✅ Localized formatting using Intl.NumberFormat
- ✅ Currency conversion (mock implementation)
- ✅ Centralized currency configuration

## Quick Start

```typescript
import { formatPrice } from "@/utils/price";

// Format with default currency (INR)
formatPrice(150); // "₹150.00"

// Format with specific currency
formatPrice(150, { currency: "USD" }); // "$150.00"
```

## Configuration

The default currency and other settings can be changed in `/src/config/currency.ts`:

```typescript
export const CURRENCY_CONFIG = {
  DEFAULT_CURRENCY: "INR" as Currency, // Change this to set default currency
  FREE_SHIPPING_THRESHOLD: 30,
  SHIPPING_COST: 5.99,
  TAX_RATE: 0.08,
} as const;
```

## API Reference

### `formatPrice(price, options?)`

Formats a price with currency symbol.

**Parameters:**

- `price: number` - The price to format
- `options?: PriceFormatOptions` - Formatting options

**Options:**

- `currency?: Currency` - Currency code (default: from config)
- `showSymbol?: boolean` - Whether to show currency symbol (default: true)
- `decimalPlaces?: number` - Number of decimal places (default: 2)

**Examples:**

```typescript
formatPrice(150); // "₹150.00"
formatPrice(150, { currency: "USD" }); // "$150.00"
formatPrice(150, { showSymbol: false }); // "150.00"
formatPrice(150, { decimalPlaces: 0 }); // "₹150"
```

### `formatPriceLocalized(price, options?)`

Formats a price with locale-specific formatting using Intl.NumberFormat.

**Parameters:**

- `price: number` - The price to format
- `options?: PriceFormatOptions` - Formatting options

**Examples:**

```typescript
formatPriceLocalized(1500, { currency: "INR" }); // "₹1,500.00"
formatPriceLocalized(1500, { currency: "USD" }); // "$1,500.00"
```

### `getCurrencySymbol(currency?)`

Gets the currency symbol for a given currency.

**Parameters:**

- `currency?: Currency` - Currency code (default: from config)

**Examples:**

```typescript
getCurrencySymbol(); // "₹" (default currency)
getCurrencySymbol("USD"); // "$"
getCurrencySymbol("EUR"); // "€"
```

### `convertPrice(price, fromCurrency, toCurrency)`

Converts price between currencies (mock implementation).

**Parameters:**

- `price: number` - The price to convert
- `fromCurrency: Currency` - Source currency
- `toCurrency: Currency` - Target currency

**Examples:**

```typescript
convertPrice(100, "USD", "INR"); // ~8300 (mock rate)
convertPrice(1000, "INR", "USD"); // ~12 (mock rate)
```

## Supported Currencies

| Currency      | Code | Symbol |
| ------------- | ---- | ------ |
| Indian Rupee  | INR  | ₹      |
| US Dollar     | USD  | $      |
| Euro          | EUR  | €      |
| British Pound | GBP  | £      |
| Japanese Yen  | JPY  | ¥      |

## Usage in Components

### Basic Usage

```typescript
import { formatPrice } from "@/utils/price";

function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
    </div>
  );
}
```

### With Different Currency

```typescript
import { formatPrice } from "@/utils/price";

function InternationalPrice({ price, userCountry }) {
  const currency = userCountry === "US" ? "USD" : "INR";

  return <span>{formatPrice(price, { currency })}</span>;
}
```

### Configuration-based Values

```typescript
import { formatPrice } from "@/utils/price";
import { getFreeShippingThreshold } from "@/config/currency";

function ShippingInfo() {
  return (
    <p>
      Free shipping on orders over {formatPrice(getFreeShippingThreshold())}
    </p>
  );
}
```

## Migration from Hardcoded Prices

If you have existing hardcoded price displays, replace them as follows:

**Before:**

```typescript
`$${price.toFixed(2)}``₹${price.toFixed(2)}`;
```

**After:**

```typescript
formatPrice(price);
formatPrice(price, { currency: "USD" }); // if you need specific currency
```

## Notes

- The currency conversion rates are mock values for demonstration
- In a production app, you would fetch real exchange rates from an API
- The default currency is set to INR but can be easily changed in the config
- All price displays throughout the app now use this centralized utility
