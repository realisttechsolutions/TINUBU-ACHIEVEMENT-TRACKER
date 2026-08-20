'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, ChevronUp, Check, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, currentLanguageOption, changeLanguage, isLoading, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'nigerian' | 'global'>('nigerian');

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);

  const nigerianLanguages = availableLanguages.filter((lang) => lang.region === 'nigeria');
  const globalLanguages = availableLanguages.filter((lang) => lang.region === 'global');

  // Handle keyboard Escape and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus first language button on open
      setTimeout(() => firstItemRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectLanguage = async (code: string) => {
    await changeLanguage(code);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans print:hidden">
      {/* Floating Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Select platform language. Current language: ${currentLanguageOption?.nativeName || 'English'}`}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gov-navy/95 dark:bg-gov-darkSurface/95 hover:bg-gov-navy text-white text-xs font-semibold shadow-xl border border-gov-gold/40 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gov-gold focus:ring-offset-2 focus:ring-offset-gov-navy"
      >
        <Globe className="h-4 w-4 text-gov-gold shrink-0" />
        <span className="tracking-wide">
          {currentLanguageOption ? currentLanguageOption.nativeName : t('language.selectLanguage')}
        </span>
        <ChevronUp
          className={`h-3.5 w-3.5 text-slate-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-gov-gold' : ''
          }`}
        />
      </button>

      {/* Language Selection Popover Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('language.switchLanguage')}
          className="absolute bottom-12 left-0 w-[310px] sm:w-[340px] max-h-[440px] flex flex-col bg-white/95 dark:bg-gov-navy/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gov-gold/30 text-gov-navy dark:text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-gov-border/40 dark:border-white/10 flex items-center justify-between bg-gov-canvas/60 dark:bg-white/5">
            <div>
              <h3 className="font-bold text-xs text-gov-navy dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-gov-gold" />
                <span>{t('language.switchLanguage')}</span>
              </h3>
              <p className="text-[11px] text-gov-slate dark:text-slate-300 mt-0.5">
                {t('language.chooseLanguage')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label={t('language.close')}
              className="p-1.5 rounded-lg text-gov-slate dark:text-slate-300 hover:text-gov-navy dark:hover:text-white hover:bg-gov-border/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gov-gold"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Group Tabs */}
          <div className="flex border-b border-gov-border/40 dark:border-white/10 bg-gov-canvas/30 dark:bg-white/5 p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('nigerian')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'nigerian'
                  ? 'bg-gov-emerald text-white shadow-sm'
                  : 'text-gov-slate dark:text-slate-300 hover:text-gov-navy dark:hover:text-white'
              }`}
            >
              {t('language.nigerianLanguages')} (5)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('global')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'global'
                  ? 'bg-gov-emerald text-white shadow-sm'
                  : 'text-gov-slate dark:text-slate-300 hover:text-gov-navy dark:hover:text-white'
              }`}
            >
              {t('language.internationalLanguages')} (10)
            </button>
          </div>

          {/* Language Options List */}
          <div className="p-2 space-y-1 overflow-y-auto max-h-[260px] overscroll-contain">
            {(activeTab === 'nigerian' ? nigerianLanguages : globalLanguages).map((lang, idx) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  ref={idx === 0 ? firstItemRef : undefined}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-gov-gold/15 dark:bg-gov-gold/20 text-gov-navy dark:text-gov-gold font-bold border border-gov-gold/40'
                      : 'hover:bg-gov-canvas dark:hover:bg-white/10 text-gov-slate dark:text-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-gov-gold`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold">{lang.nativeName}</span>
                    <span className="text-[11px] text-gov-slate/80 dark:text-slate-400">
                      ({lang.name})
                    </span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-gov-emerald shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-2.5 border-t border-gov-border/40 dark:border-white/10 bg-gov-canvas/40 dark:bg-white/5 text-[10px] text-center text-gov-slate dark:text-slate-400">
            <span>{isLoading ? t('language.switching') : t('language.poweredBy')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
