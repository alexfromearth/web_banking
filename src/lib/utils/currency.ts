import { Currency } from '../db/dbTypes';

const exchangeRates: Record<Currency, number> = {
  [Currency.EUR]: 1.0,
  [Currency.USD]: 1.08,
};

export const convertCurrency = (amountInCents: number, fromCurrency: Currency, toCurrency: Currency): number => {
  if (fromCurrency === toCurrency) {
    return amountInCents;
  }

  const amountInBaseCurrency = amountInCents / exchangeRates[fromCurrency];

  const convertedAmount = amountInBaseCurrency * exchangeRates[toCurrency];

  return Math.round(convertedAmount);
};

export function formatCurrency(balanceInCents: number, currency: Currency): string {
  const amount = balanceInCents / 100;
  return new Intl.NumberFormat('en-EN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
