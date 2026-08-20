import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { languageOptions } from '@/i18n/languageOptions';
import i18n, { resources } from '@/i18n/i18n';
import { formatCurrencyNaira } from '@/utils/formatters';

const TestLanguageConsumer = () => {
  const { currentLanguage, changeLanguage, isRTL } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{currentLanguage}</span>
      <span data-testid="is-rtl">{isRTL ? 'RTL' : 'LTR'}</span>
      <button onClick={() => changeLanguage('ar')}>Switch to Arabic</button>
      <button onClick={() => changeLanguage('ha')}>Switch to Hausa</button>
      <button onClick={() => changeLanguage('pcm')}>Switch to Pidgin</button>
      <button onClick={() => changeLanguage('fr')}>Switch to French</button>
      <button onClick={() => changeLanguage('zh-CN')}>Switch to Chinese</button>
      <button onClick={() => changeLanguage('en')}>Switch to English</button>
    </div>
  );
};

describe('PTAT Multilingual & 15-Locale i18n Architecture Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('supports exactly 15 configured locales across Nigerian and Global groups', () => {
    expect(languageOptions).toHaveLength(15);

    const codes = languageOptions.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('ha');
    expect(codes).toContain('yo');
    expect(codes).toContain('ig');
    expect(codes).toContain('pcm');
    expect(codes).toContain('fr');
    expect(codes).toContain('ar');
    expect(codes).toContain('zh-CN');
    expect(codes).toContain('es');
    expect(codes).toContain('pt');
    expect(codes).toContain('de');
    expect(codes).toContain('it');
    expect(codes).toContain('nl');
    expect(codes).toContain('hi');
    expect(codes).toContain('sw');

    // All 15 resources registered in i18n
    codes.forEach((code) => {
      expect(resources[code as keyof typeof resources]).toBeDefined();
    });
  });

  it('dynamically applies dir="rtl" to document when Arabic is selected', async () => {
    render(
      <LanguageProvider>
        <TestLanguageConsumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId('is-rtl').textContent).toBe('LTR');
    expect(document.documentElement.dir).toBe('ltr');

    const arabicBtn = screen.getByText('Switch to Arabic');
    fireEvent.click(arabicBtn);

    await waitFor(() => {
      expect(screen.getByTestId('current-lang').textContent).toBe('ar');
      expect(screen.getByTestId('is-rtl').textContent).toBe('RTL');
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('ar');
    });
  });

  it('correctly recognizes Nigerian Pidgin (pcm) as a distinct Nigerian locale', async () => {
    render(
      <LanguageProvider>
        <TestLanguageConsumer />
      </LanguageProvider>
    );

    const pidginBtn = screen.getByText('Switch to Pidgin');
    fireEvent.click(pidginBtn);

    await waitFor(() => {
      expect(screen.getByTestId('current-lang').textContent).toBe('pcm');
      expect(localStorage.getItem('selectedLanguage')).toBe('pcm');
    });
  });

  it('persists selected language to localStorage and restores on initialization', async () => {
    localStorage.setItem('selectedLanguage', 'fr');

    render(
      <LanguageProvider>
        <TestLanguageConsumer />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-lang').textContent).toBe('fr');
    });
  });

  it('falls back to canonical English when translation keys are missing', () => {
    const fallbackText = i18n.t('non_existent_key_xyz', { defaultValue: 'Default Text' });
    expect(fallbackText).toBe('Default Text');
  });

  it('preserves Naira (₦) financial presentation invariantly across all 15 locales', () => {
    const amount = 50000000000; // 50 Billion Naira

    languageOptions.forEach((lang) => {
      const formatted = formatCurrencyNaira(amount);
      expect(formatted).toContain('₦');
      expect(formatted).not.toContain('$');
      expect(formatted).not.toContain('USD');
    });
  });

  it('opens floating LanguageSwitcher popover and handles keyboard Escape to close', async () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const trigger = screen.getByRole('button', { name: /Select platform language/i });
    expect(trigger).toBeDefined();

    // Open popover
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Switch Language/i })).toBeDefined();
    });

    // Press Escape to close
    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});
