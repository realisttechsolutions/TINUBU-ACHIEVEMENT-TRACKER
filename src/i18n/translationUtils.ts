
import i18n from './i18n';

// This function can be used to translate any string throughout the app
export const translate = (key: string, options?: Record<string, any>): string => {
  const translation = i18n.t(key, options);
  return typeof translation === 'string' ? translation : key;
};

// This function provides a fallback mechanism if the key doesn't exist
export const translateWithFallback = (key: string, fallback: string, options?: Record<string, any>): string => {
  const translation = i18n.t(key, { ...options, defaultValue: fallback });
  return typeof translation === 'string' ? translation : fallback;
};
