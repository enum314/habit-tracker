export const currencies = ["USD", "EUR", "GBP", "PHP"] as const;

export type Currency = (typeof currencies)[number];

export function getCurrencyName(code: string): string {
  const currencyNames: Record<string, string> = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    PHP: "Philippine Peso",
  };

  return currencyNames[code] || code;
}

export function getCurrencySymbol(code: string): string {
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    PHP: "₱",
  };

  return currencySymbols[code] || code;
}
