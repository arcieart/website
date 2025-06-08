import { formatPrice, formatPriceLocalized, Currency } from "@/utils/price";

/**
 * Example component demonstrating how to use different currencies
 * This component is for demonstration purposes only
 */
export function CurrencyExample() {
  const samplePrice = 150;

  const currencies: Currency[] = ["INR", "USD", "EUR", "GBP", "JPY"];

  return (
    <div className="p-6 bg-card border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">
        Currency Formatting Examples
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Default Currency (from config):</h4>
          <p className="text-lg">{formatPrice(samplePrice)}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">All Supported Currencies:</h4>
          <div className="grid grid-cols-2 gap-2">
            {currencies.map((currency) => (
              <div key={currency} className="flex justify-between">
                <span>{currency}:</span>
                <span>{formatPrice(samplePrice, { currency })}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Localized Formatting:</h4>
          <div className="grid grid-cols-1 gap-2">
            {currencies.map((currency) => (
              <div key={currency} className="flex justify-between">
                <span>{currency} (localized):</span>
                <span>{formatPriceLocalized(samplePrice, { currency })}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Without Symbol:</h4>
          <p>{formatPrice(samplePrice, { showSymbol: false })}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Different Decimal Places:</h4>
          <div className="space-y-1">
            <p>0 decimals: {formatPrice(samplePrice, { decimalPlaces: 0 })}</p>
            <p>1 decimal: {formatPrice(samplePrice, { decimalPlaces: 1 })}</p>
            <p>3 decimals: {formatPrice(samplePrice, { decimalPlaces: 3 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
