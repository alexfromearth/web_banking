import { describe, expect, it } from 'vitest';
import { convertCurrency, formatCurrency } from '../currency';
import { Currency } from '@/lib/db/dbTypes';

describe('formatCurrency', () => {
  it('should format a standard amount in USD correctly', () => {
    expect(formatCurrency(123456, Currency.USD)).toMatch(/1,234.56/);
  });

  it('should format a standard amount in EUR correctly', () => {
    expect(formatCurrency(12345, Currency.EUR)).toMatch(/123.45/);
  });

  it('should format a zero amount correctly', () => {
    expect(formatCurrency(0, Currency.EUR)).toMatch(/0.00/);
  });

  it('should format an amount less than 1 correctly', () => {
    expect(formatCurrency(5, Currency.USD)).toMatch(/0.05/);
  });
});

describe('convertCurrency', () => {
  it('should return the same amount if currencies are the same', () => {
    expect(convertCurrency(10000, Currency.USD, Currency.USD)).toBe(10000);
  });

  it('should correctly convert from EUR to USD', () => {
    expect(convertCurrency(10000, Currency.EUR, Currency.USD)).toBe(10800);
  });

  it('should correctly convert from USD to EUR', () => {
    expect(convertCurrency(10800, Currency.USD, Currency.EUR)).toBe(10000);
  });

  it('should handle rounding correctly', () => {
    expect(convertCurrency(100, Currency.USD, Currency.EUR)).toBe(93);
  });
});
