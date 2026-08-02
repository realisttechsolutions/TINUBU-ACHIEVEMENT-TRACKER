import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { 
  enUS, es, fr, ar, 
  enGB, // for English
} from 'date-fns/locale';

// Language-specific locales mapping
const localeMap = {
  'en': enUS,
  'es': es,
  'fr': fr,
  'ar': ar,
  'ha': enGB, // Fallback to English for Nigerian languages
  'yo': enGB,
  'ig': enGB,
  'pcm': enGB,
  'zh': enGB, // Add Chinese support later
  'pt': enGB, // Add Portuguese support later
  'de': enGB, // Add German support later
  'ru': enGB, // Add Russian support later
  'hi': enGB, // Add Hindi support later
  'ja': enGB, // Add Japanese support later
  'it': enGB, // Add Italian support later
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
  const locale = getLocaleString(language);
  
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
  value: number, 
  language: string = 'en',
  compact: boolean = false
): string => {
  if (compact) {
    return '₦' + formatLargeNumber(value, language);
  }
  return formatCurrency(value, language, 'NGN');
};

// Helper function to get locale string for Intl APIs
const getLocaleString = (language: string): string => {
  const localeStrings = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'ar': 'ar-SA',
    'ha': 'en-NG', // Nigerian English for Hausa
    'yo': 'en-NG', // Nigerian English for Yoruba
    'ig': 'en-NG', // Nigerian English for Igbo
    'pcm': 'en-NG', // Nigerian English for Pidgin
    'zh': 'zh-CN',
    'pt': 'pt-BR',
    'de': 'de-DE',
    'ru': 'ru-RU',
    'hi': 'hi-IN',
    'ja': 'ja-JP',
    'it': 'it-IT',
  };
  
  return localeStrings[language] || 'en-US';
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
  const quarterMap = {
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