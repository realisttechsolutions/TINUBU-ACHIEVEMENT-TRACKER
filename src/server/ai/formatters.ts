/**
 * Format exact decimal numeric strings with commas and proper decimal precision.
 */
export function formatExactDecimal(value: string): string {
  const exact = String(value ?? '').trim();
  if (!/^-?\d+(?:\.\d+)?$/.test(exact)) return exact;
  const sign = exact.startsWith('-') ? '-' : '';
  const unsigned = sign ? exact.slice(1) : exact;
  const [integer, fraction] = unsigned.split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${grouped}${fraction === undefined ? '' : `.${fraction}`}`;
}

/**
 * Format public financial amount into human-readable currency representation.
 */
export function formatPublicFinancialAmount(amountExact: string, currencyCode: string, financialType?: string): string {
  const num = Number(amountExact);
  if (isNaN(num)) return `${currencyCode} ${amountExact}`;

  const symbol = currencyCode === 'NGN' ? '₦' : (currencyCode === 'USD' ? '$' : `${currencyCode} `);

  if (num >= 1_000_000_000_000) {
    const formatted = (num / 1_000_000_000_000).toFixed(2).replace(/\.00$/, '');
    return `${symbol}${formatted} Trillion`;
  }
  if (num >= 1_000_000_000) {
    const formatted = (num / 1_000_000_000).toFixed(2).replace(/\.00$/, '');
    return `${symbol}${formatted} Billion`;
  }
  if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(2).replace(/\.00$/, '');
    return `${symbol}${formatted} Million`;
  }

  return `${symbol}${formatExactDecimal(amountExact)}`;
}

/**
 * Public Presentation Text Sanitizer:
 * Normalizes text to ensure safe public-facing presentation.
 */
export function sanitizePublicPresentationText(text: string | null | undefined): string {
  if (!text) return '';
  let result = String(text);

  // Contextual cleanups & whitespace normalization
  result = result
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.:;])/g, '$1')
    .replace(/,\s*,/g, ',')
    .trim();

  return result;
}
