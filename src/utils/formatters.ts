import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  enUS, es, fr, ar,
  enGB, de, it, nl, pt, hi
} from 'date-fns/locale';

// Language-specific locales mapping for all 15 supported languages
const localeMap: Record<string, any> = {
  'en': enGB,
  'ha': enGB, // Nigerian English fallback
  'yo': enGB,
  'ig': enGB,
  'pcm': enGB,
  'fr': fr,
  'ar': ar,
  'zh-CN': enGB,
  'zh': enGB,
  'es': es,
  'pt': pt,
  'de': de,
  'it': it,
  'nl': nl,
  'hi': hi,
  'sw': enGB,
};

// Helper function to get locale string for Intl APIs
const getLocaleString = (language: string): string => {
  const localeStrings: Record<string, string> = {
    'en': 'en-NG',
    'ha': 'ha-NG',
    'yo': 'yo-NG',
    'ig': 'ig-NG',
    'pcm': 'en-NG',
    'fr': 'fr-FR',
    'ar': 'ar-SA',
    'zh-CN': 'zh-CN',
    'zh': 'zh-CN',
    'es': 'es-ES',
    'pt': 'pt-PT',
    'de': 'de-DE',
    'it': 'it-IT',
    'nl': 'nl-NL',
    'hi': 'hi-IN',
    'sw': 'sw-KE',
  };

  return localeStrings[language] || 'en-NG';
};

// Number formatting with locale support
export const formatNumber = (
  value: number,
  language: string = 'en',
  options: Intl.NumberFormatOptions = {}
): string => {
  const locale = getLocaleString(language);
  return new Intl.NumberFormat(locale, options).format(value);
};

// Currency formatting
export const formatCurrency = (
  value: number,
  language: string = 'en',
  currency: string = 'NGN'
): string => {
  const locale = getLocaleString(language);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Percentage formatting
export const formatPercentage = (
  value: number,
  language: string = 'en',
  decimalPlaces: number = 1
): string => {
  const locale = getLocaleString(language);
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value / 100);
};

// Date formatting with language support
export const formatDate = (
  date: Date | string | number,
  language: string = 'en',
  formatString: string = 'PPP',
  timeZone: string = 'Africa/Lagos'
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const locale = localeMap[language] || localeMap['en'];

  try {
    return formatInTimeZone(dateObj, timeZone, formatString, { locale });
  } catch (error) {
    // Fallback to regular format if timezone formatting fails
    return format(dateObj, formatString, { locale });
  }
};

// Large number formatting (e.g., 1.5K, 2.3M, 4.2B, 1.1T)
export const formatLargeNumber = (
  value: number,
  language: string = 'en'
): string => {
  if (value >= 1e12) {
    return formatNumber(value / 1e12, language, { maximumFractionDigits: 1 }) + 'T';
  } else if (value >= 1e9) {
    return formatNumber(value / 1e9, language, { maximumFractionDigits: 1 }) + 'B';
  } else if (value >= 1e6) {
    return formatNumber(value / 1e6, language, { maximumFractionDigits: 1 }) + 'M';
  } else if (value >= 1e3) {
    return formatNumber(value / 1e3, language, { maximumFractionDigits: 1 }) + 'K';
  }

  return formatNumber(value, language);
};

// Nigerian Naira formatting with appropriate suffix
export const formatNaira = (
  value: number | string,
  language: string = 'en',
  compact: boolean = false
): string => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num) || num === 0) return '₦0';
  if (compact) {
    return '₦' + formatLargeNumber(num, language);
  }
  const sign = num < 0 ? '-' : '';
  const absNum = Math.abs(num);
  return `${sign}₦${formatNumber(absNum, language, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

// Alias for formatNaira
export const formatCurrencyNaira = formatNaira;

/**
 * Canonical PTAT Public Currency Formatter (Section 16)
 * Public standard: Nigerian Naira (₦).
 * Consistent institutional formatting for public money values.
 */
export const formatPublicMoney = (
  value: number | string,
  options: {
    language?: string;
    compact?: boolean;
    fullWord?: boolean;
    precision?: number;
  } = {}
): string => {
  const { language = 'en', compact = false, fullWord = true, precision = 1 } = options;
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num)) return '₦0';

  const absVal = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (fullWord) {
    if (absVal >= 1e12) {
      const formatted = (absVal / 1e12).toFixed(precision).replace(/\.0+$/, '');
      return `${sign}₦${formatted} trillion`;
    } else if (absVal >= 1e9) {
      const formatted = (absVal / 1e9).toFixed(precision).replace(/\.0+$/, '');
      return `${sign}₦${formatted} billion`;
    } else if (absVal >= 1e6) {
      const formatted = (absVal / 1e6).toFixed(precision).replace(/\.0+$/, '');
      return `${sign}₦${formatted} million`;
    } else if (absVal >= 1e3) {
      const formatted = (absVal / 1e3).toFixed(precision).replace(/\.0+$/, '');
      return `${sign}₦${formatted} thousand`;
    }
  }

  return formatNaira(num, language, compact);
};

// Relative time formatting
export const formatRelativeTime = (
  date: Date | string | number,
  language: string = 'en'
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const locale = getLocaleString(language);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 604800) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 2629746) {
    return rtf.format(-Math.floor(diffInSeconds / 604800), 'week');
  } else if (diffInSeconds < 31556952) {
    return rtf.format(-Math.floor(diffInSeconds / 2629746), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31556952), 'year');
  }
};

// Format quarter display
export const formatQuarter = (quarter: number, year: number, language: string = 'en'): string => {
  const quarterMap: Record<string, string> = {
    'en': 'Q',
    'es': 'T', // Trimestre
    'fr': 'T', // Trimestre
    'ar': 'ر', // ربع
    'ha': 'Q', // Quarter (English fallback)
    'yo': 'Q', // Quarter (English fallback)
    'ig': 'Q', // Quarter (English fallback)
    'pcm': 'Q', // Quarter (English fallback)
  };

  const prefix = quarterMap[language] || 'Q';
  return `${prefix}${quarter} ${year}`;
};
