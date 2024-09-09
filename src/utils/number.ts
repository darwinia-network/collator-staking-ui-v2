import { BigNumber } from 'bignumber.js';

import { DECIMAL } from '@/config/site';

/**
 * Formats a number or a string representing a number by adding thousands separators.
 *
 * @param {number | string} number - The number or string to format.
 * @returns {string} - The formatted number as a string with thousands separators.
 */
export function formatNumberWithThousandsSeparator(number: number | string): string {
  // Convert the number to a string and split it into integer and decimal parts.
  const parts = number.toString().split('.');

  // Use a regular expression to insert commas every three digits in the integer part.
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Rejoin the integer and decimal parts (if any) and return the formatted string.
  return parts.join('.');
}

/**
 * Splits a number or a string representing a number into its integer and decimal parts.
 *
 * @param {number | string} number - The number or string to split.
 * @returns {[string, string]} - An array containing the integer part as the first element,
 *                               and the decimal part as the second element. If there is no
 *                               decimal part, the second element will be an empty string.
 */
export function splitNumberIntoParts(number: number | string): [string, string] {
  // Convert the number to a string (if it isn't already) and split it at the decimal point.
  const parts = number.toString().split('.');

  // The integer part is always present, so we assign it directly.
  const integerPart = parts[0];

  // The decimal part may not be present, so we use a ternary operator to handle that case.
  const decimalPart = parts.length > 1 ? parts[1] : '';

  // Return the integer and decimal parts as an array of two strings.
  return [integerPart, decimalPart];
}
/**
 * Validates whether the first number is not greater than the second number.
 *
 * @param firstValue The first number as a string.
 * @param secondValue The second number as a string.
 * @returns true if the first number is not greater than the second number, and both are valid numbers; otherwise, false.
 */
export const validateNotGreaterThan = (firstValue: string, secondValue: string): boolean => {
  const firstBN = new BigNumber(firstValue);
  const secondBN = new BigNumber(secondValue);

  // 检查两个值是否都是有效数字
  if (!firstBN.isFinite() || !secondBN.isFinite()) {
    return false;
  }

  // 检查第一个数字是否不大于第二个数字
  return firstBN.lte(secondBN);
};

export function toFixed(value: string, fractionDigits: number = DECIMAL): string {
  const bn = new BigNumber(value);
  if (!bn.isFinite() || typeof fractionDigits !== 'number' || fractionDigits < 0) {
    return value;
  }

  return bn.toFixed(fractionDigits, BigNumber.ROUND_HALF_UP);
}

export type FormattedNumericValue = {
  original: string | number;
  originalFormatNumberWithThousandsSeparator: string;
  fixed: string;
  integerPart: string;
  decimalPart: string;
  formatted: string;
};

/**
 * Formats a numeric value and returns an object with various representations of the number.
 *
 * @param {string} data - The numeric value to format.
 * @returns {FormattedNumericValue} An object containing different representations of the formatted number.
 *
 * @example
 * // Returns:
 * // {
 * //   original: "1234.5678",
 * //   originalFormatNumberWithThousandsSeparator: "1,234.5678",
 * //   fixed: "1234.57",
 * //   integerPart: "1,234",
 * //   decimalPart: "57",
 * //   formatted: "1,234.57"
 * // }
 * formatNumericValue("1234.5678", 2);
 */
export function formatNumericValue(
  data: string,
  fractionDigits: number = DECIMAL
): FormattedNumericValue {
  if (data && new BigNumber(data).isFinite()) {
    const fixedNumber = toFixed(data, fractionDigits);
    const [integerPart, decimalPart] = splitNumberIntoParts(fixedNumber);
    const formattedIntegerPart = formatNumberWithThousandsSeparator(integerPart);

    return {
      original: data,
      originalFormatNumberWithThousandsSeparator: formatNumberWithThousandsSeparator(data),
      fixed: fixedNumber,
      integerPart: formattedIntegerPart,
      decimalPart,
      formatted: `${formattedIntegerPart}${decimalPart ? `.${decimalPart}` : ''}`
    };
  }
  return {
    original: '0',
    originalFormatNumberWithThousandsSeparator: '0',
    fixed: '0',
    integerPart: '0',
    decimalPart: '',
    formatted: '0'
  };
}
