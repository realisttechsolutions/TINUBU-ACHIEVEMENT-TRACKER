'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import i18n from '../i18n/i18n';
import { languageOptions, LanguageOption } from '../i18n/languageOptions';

interface LanguageContextType {
  currentLanguage: string;
  currentLanguageOption: LanguageOption;
  changeLanguage: (code: string) => Promise<void>;
  isLoading: boolean;
  availableLanguages: LanguageOption[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(false);

  const applyDocumentLanguageAttributes = useCallback((langCode: string) => {
    if (typeof document === 'undefined') return;
    const isArabic = langCode === 'ar';
    document.documentElement.lang = langCode;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    if (isArabic) {
      document.documentElement.classList.add('rtl');
      document.body.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
      document.body.classList.remove('rtl');
    }
  }, []);

  const changeLanguage = async (language: string) => {
    // Normalize zh to zh-CN if needed
    const normalizedCode = language === 'zh' ? 'zh-CN' : language;
    const matchedOption = languageOptions.find((l) => l.code === normalizedCode) || languageOptions[0];

    setIsLoading(true);
    try {
      await i18n.changeLanguage(matchedOption.code);
      setCurrentLanguage(matchedOption.code);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('selectedLanguage', matchedOption.code);
        localStorage.setItem('i18nextLng', matchedOption.code);
      }
      applyDocumentLanguageAttributes(matchedOption.code);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: matchedOption.code }));
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let savedLanguage = 'en';
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('selectedLanguage') || localStorage.getItem('i18nextLng');
      if (stored) {
        const found = languageOptions.find((l) => l.code === stored || (stored === 'zh' && l.code === 'zh-CN'));
        if (found) savedLanguage = found.code;
      }
    }
    setCurrentLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
    applyDocumentLanguageAttributes(savedLanguage);
  }, [applyDocumentLanguageAttributes]);

  const currentLanguageOption =
    languageOptions.find((lang) => lang.code === currentLanguage) || languageOptions[0];
  const isRTL = currentLanguageOption.dir === 'rtl';

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        currentLanguageOption,
        changeLanguage,
        isLoading,
        availableLanguages: languageOptions,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
