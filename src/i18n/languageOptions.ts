
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
  region: 'nigeria' | 'global';
}

export const languageOptions: LanguageOption[] = [
  // Nigerian languages
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'global',
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    region: 'nigeria',
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    region: 'nigeria',
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Igbo',
    region: 'nigeria',
  },
  {
    code: 'pcm',
    name: 'Nigerian Pidgin',
    nativeName: 'Pidgin',
    region: 'nigeria',
  },
  
  // Global languages
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    region: 'global',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'global',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'global',
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '中文',
    region: 'global',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'global',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'global',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    region: 'global',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'global',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'global',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    region: 'global',
  },
];
