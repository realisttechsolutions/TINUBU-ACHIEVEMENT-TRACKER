export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  region: 'nigeria' | 'global';
  dir?: 'ltr' | 'rtl';
}

export const languageOptions: LanguageOption[] = [
  // Nigerian Languages
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'nigeria',
    dir: 'ltr',
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    region: 'nigeria',
    dir: 'ltr',
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    region: 'nigeria',
    dir: 'ltr',
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Igbo',
    region: 'nigeria',
    dir: 'ltr',
  },
  {
    code: 'pcm',
    name: 'Nigerian Pidgin',
    nativeName: 'Pidgin',
    region: 'nigeria',
    dir: 'ltr',
  },

  // International Languages
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    region: 'global',
    dir: 'ltr',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'global',
    dir: 'rtl',
  },
  {
    code: 'zh-CN',
    name: 'Simplified Chinese',
    nativeName: '中文 (简体)',
    region: 'global',
    dir: 'ltr',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'global',
    dir: 'ltr',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'global',
    dir: 'ltr',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'global',
    dir: 'ltr',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    region: 'global',
    dir: 'ltr',
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    region: 'global',
    dir: 'ltr',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'global',
    dir: 'ltr',
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    region: 'global',
    dir: 'ltr',
  },
];
