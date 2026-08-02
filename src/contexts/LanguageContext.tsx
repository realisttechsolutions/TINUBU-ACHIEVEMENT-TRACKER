
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '../i18n/i18n';
import { languageOptions, LanguageOption } from '../i18n/languageOptions';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (code: string) => Promise<void>;
  isLoading: boolean;
  availableLanguages: LanguageOption[];
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
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isLoading, setIsLoading] = useState(false);

  // Simplified since we now have static translations loaded
  const loadResources = async (language: string) => {
    // Resources are already loaded statically in i18n.ts
    return Promise.resolve();
  };

  const applyDocumentLanguageAttributes = (langCode: string) => {
    document.documentElement.lang = langCode;
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
  };

  const changeLanguage = async (language: string) => {
    setIsLoading(true);
    try {
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      localStorage.setItem('selectedLanguage', language);
      applyDocumentLanguageAttributes(language);
      
      // Trigger a page update to reflect language changes
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || localStorage.getItem('i18nextLng') || 'en';
    const activeLang = (savedLanguage && languageOptions.find(lang => lang.code === savedLanguage)) ? savedLanguage : 'en';
    setCurrentLanguage(activeLang);
    i18n.changeLanguage(activeLang);
    applyDocumentLanguageAttributes(activeLang);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        isLoading,
        availableLanguages: languageOptions,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
