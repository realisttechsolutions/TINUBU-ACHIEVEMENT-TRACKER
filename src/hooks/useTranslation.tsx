
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  const { currentLanguage, changeLanguage, isLoading, availableLanguages } = useLanguage();

  // Enhanced translate function with HTML support and interpolation
  const translate = (key: string, options?: Record<string, any>): string => {
    const translation = t(key, options);
    return typeof translation === 'string' ? translation : key;
  };

  return {
    t: translate,
    i18n,
    currentLanguage,
    changeLanguage,
    isLoading,
    availableLanguages
  };
};
