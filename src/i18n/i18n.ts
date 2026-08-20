import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources for all 15 supported locales
import enTranslations from './resources/en.json';
import haTranslations from './resources/ha.json';
import yoTranslations from './resources/yo.json';
import igTranslations from './resources/ig.json';
import pcmTranslations from './resources/pcm.json';
import frTranslations from './resources/fr.json';
import arTranslations from './resources/ar.json';
import zhCnTranslations from './resources/zh-CN.json';
import esTranslations from './resources/es.json';
import ptTranslations from './resources/pt.json';
import deTranslations from './resources/de.json';
import itTranslations from './resources/it.json';
import nlTranslations from './resources/nl.json';
import hiTranslations from './resources/hi.json';
import swTranslations from './resources/sw.json';

export const resources = {
  en: { translation: enTranslations },
  ha: { translation: haTranslations },
  yo: { translation: yoTranslations },
  ig: { translation: igTranslations },
  pcm: { translation: pcmTranslations },
  fr: { translation: frTranslations },
  ar: { translation: arTranslations },
  'zh-CN': { translation: zhCnTranslations },
  es: { translation: esTranslations },
  pt: { translation: ptTranslations },
  de: { translation: deTranslations },
  it: { translation: itTranslations },
  nl: { translation: nlTranslations },
  hi: { translation: hiTranslations },
  sw: { translation: swTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for React
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'selectedLanguage',
    },
  });

export default i18n;
