
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import enTranslations from './resources/en.json';
import haTranslations from './resources/ha.json';
import yoTranslations from './resources/yo.json';
import igTranslations from './resources/ig.json';
import pcmTranslations from './resources/pcm.json';
import frTranslations from './resources/fr.json';
import esTranslations from './resources/es.json';
import arTranslations from './resources/ar.json';

const resources = {
  en: { translation: enTranslations },
  ha: { translation: haTranslations },
  yo: { translation: yoTranslations },
  ig: { translation: igTranslations },
  pcm: { translation: pcmTranslations },
  fr: { translation: frTranslations },
  es: { translation: esTranslations },
  ar: { translation: arTranslations },
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
    },
  });

export default i18n;
