import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import GlobalContextBar from '@/components/layout/GlobalContextBar';

describe('Global Abuja Live Context Bar & Weather Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date('2026-08-20T10:00:00.000Z')); // 11:00:00 in Africa/Lagos (UTC+1)
    
    // Default mock for weather API
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 28.4,
          weather_code: 2,
          is_day: 1,
        },
      }),
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders Abuja, Nigeria location and national seat indicator', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <GlobalContextBar />
        </LanguageProvider>
      );
    });

    expect(screen.getByText('Abuja, Nigeria')).toBeDefined();
    expect(screen.getByText('Seat of Government')).toBeDefined();
  });

  it('formats live time strictly in Africa/Lagos WAT timezone with aria-live="off"', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <GlobalContextBar />
        </LanguageProvider>
      );
    });

    // 10:00 UTC = 11:00 WAT in Africa/Lagos
    const clockContainer = screen.getByText(/11:00:00 WAT/).closest('[aria-live="off"]');
    expect(clockContainer).toBeDefined();
    expect(clockContainer?.getAttribute('aria-live')).toBe('off');
  });

  it('updates live clock tick smoothly after 1 second', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <GlobalContextBar />
        </LanguageProvider>
      );
    });

    expect(screen.getByText(/11:00:00 WAT/)).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/11:00:01 WAT/)).toBeDefined();
  });

  it('successfully renders Abuja weather temperature and condition', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <GlobalContextBar />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('28°C')).toBeDefined();
      expect(screen.getByText('Partly Cloudy')).toBeDefined();
    });

    // Check accessible weather label
    const weatherContainer = screen.getByLabelText(/Abuja weather: 28 degrees Celsius, Partly Cloudy/i);
    expect(weatherContainer).toBeDefined();
  });

  it('gracefully degrades when weather service fails or is offline', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    await act(async () => {
      render(
        <LanguageProvider>
          <GlobalContextBar />
        </LanguageProvider>
      );
    });

    // Time and date must render without interruption
    expect(screen.getByText('Abuja, Nigeria')).toBeDefined();
    expect(screen.getByText(/11:00:00 WAT/)).toBeDefined();

    // No broken NaN or undefined text
    expect(screen.queryByText(/NaN/)).toBeNull();
    expect(screen.queryByText(/undefined/)).toBeNull();
  });
});
