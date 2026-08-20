'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Sun, Cloud, CloudSun, CloudRain, CloudLightning, CloudDrizzle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  conditionKey: string;
  isDay: boolean;
}

// In-memory cache for weather to avoid repeated client fetches
let cachedWeather: { data: WeatherData; timestamp: number } | null = null;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const GlobalContextBar: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(cachedWeather?.data || null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Initialize clock and update every second
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch Abuja weather asynchronously with graceful degradation
  useEffect(() => {
    const fetchAbujaWeather = async () => {
      // Check cache first
      if (cachedWeather && Date.now() - cachedWeather.timestamp < CACHE_DURATION_MS) {
        setWeather(cachedWeather.data);
        return;
      }

      try {
        setWeatherLoading(true);
        // Abuja Coordinates: Lat 9.0765, Lon 7.3986
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=9.0765&longitude=7.3986&current=temperature_2m,weather_code,is_day',
          { cache: 'no-store' }
        );

        if (!res.ok) {
          throw new Error(`Weather fetch status: ${res.status}`);
        }

        const data = await res.json();
        if (data && data.current && typeof data.current.temperature_2m === 'number') {
          const temp = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code || 0;
          const isDay = data.current.is_day === 1;

          // Map WMO Weather Interpretation Codes to condition keys
          let conditionKey = 'clear';
          if (code === 0) conditionKey = isDay ? 'sunny' : 'clear';
          else if (code === 1 || code === 2) conditionKey = 'partlyCloudy';
          else if (code === 3) conditionKey = 'cloudy';
          else if (code === 45 || code === 48) conditionKey = 'overcast';
          else if (code >= 51 && code <= 57) conditionKey = 'drizzle';
          else if (code >= 61 && code <= 67) conditionKey = 'rainy';
          else if (code >= 80 && code <= 82) conditionKey = 'rainy';
          else if (code >= 95 && code <= 99) conditionKey = 'thunderstorm';

          const weatherObj: WeatherData = {
            temperature: temp,
            weatherCode: code,
            conditionKey,
            isDay,
          };

          cachedWeather = { data: weatherObj, timestamp: Date.now() };
          setWeather(weatherObj);
        }
      } catch (err) {
        // Silently fail gracefully without throwing or displaying error artifacts
        // Weather remains null, clock continues seamlessly
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchAbujaWeather();
  }, []);

  // Format Date and Time for Africa/Lagos (UTC+01:00)
  const { formattedDate, formattedTimeDesktop, formattedTimeMobile } = useMemo(() => {
    if (!currentTime) {
      return {
        formattedDate: '',
        formattedTimeDesktop: '',
        formattedTimeMobile: '',
      };
    }

    try {
      // Map locale code for Intl
      const intlLocale = currentLanguage === 'pcm' ? 'en-NG' : currentLanguage === 'zh-CN' ? 'zh-CN' : currentLanguage;

      const dateStr = new Intl.DateTimeFormat(intlLocale, {
        timeZone: 'Africa/Lagos',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(currentTime);

      const timeDesktopStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(currentTime);

      const timeMobileStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(currentTime);

      return {
        formattedDate: dateStr,
        formattedTimeDesktop: `${timeDesktopStr} WAT`,
        formattedTimeMobile: `${timeMobileStr} WAT`,
      };
    } catch {
      // Fallback
      return {
        formattedDate: 'Abuja Date',
        formattedTimeDesktop: 'WAT Live',
        formattedTimeMobile: 'WAT',
      };
    }
  }, [currentTime, currentLanguage]);

  // Weather semantic icon component
  const WeatherIcon = useMemo(() => {
    if (!weather) return null;
    switch (weather.conditionKey) {
      case 'sunny':
        return <Sun className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      case 'clear':
        return <Sun className="h-3.5 w-3.5 text-amber-300 shrink-0" />;
      case 'partlyCloudy':
        return <CloudSun className="h-3.5 w-3.5 text-amber-300 shrink-0" />;
      case 'cloudy':
      case 'overcast':
        return <Cloud className="h-3.5 w-3.5 text-slate-300 shrink-0" />;
      case 'drizzle':
        return <CloudDrizzle className="h-3.5 w-3.5 text-blue-300 shrink-0" />;
      case 'rainy':
        return <CloudRain className="h-3.5 w-3.5 text-blue-400 shrink-0" />;
      case 'thunderstorm':
        return <CloudLightning className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      default:
        return <Sun className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
    }
  }, [weather]);

  const weatherLabel = weather ? t(`contextBar.${weather.conditionKey}`) || 'Clear' : '';
  const accessibleWeatherText = weather
    ? `Abuja weather: ${weather.temperature} degrees Celsius, ${weatherLabel}`
    : 'Abuja weather';

  return (
    <aside
      aria-label="Federal Capital Territory Live Context Bar"
      className="w-full bg-gov-navy dark:bg-gov-darkSurface border-b border-gov-gold/25 text-white py-1 px-3 sm:px-6 transition-all"
    >
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-3 text-[11px] sm:text-xs text-slate-200">
        {/* Left Context: Location & National Seat Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gov-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gov-emerald" />
          </span>
          <span className="font-semibold text-white tracking-tight flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gov-gold shrink-0" />
            <span>{t('contextBar.location')}</span>
          </span>
          <span className="text-slate-400 hidden md:inline">·</span>
          <span className="text-slate-300 hidden md:inline font-mono text-[10px] tracking-wider uppercase bg-white/10 px-1.5 py-0.2 rounded border border-white/10">
            Seat of Government
          </span>
        </div>

        {/* Center & Right Context: Live WAT Time + Abuja Weather */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0 font-medium">
          {/* Live Date */}
          {formattedDate && (
            <span className="text-slate-200 hidden sm:inline">
              {formattedDate}
            </span>
          )}

          {formattedDate && <span className="text-slate-400 hidden sm:inline">·</span>}

          {/* Live Clock (strictly Africa/Lagos WAT) - aria-live="off" to prevent screen reader spam */}
          <div
            aria-live="off"
            className="flex items-center gap-1 font-mono text-gov-gold font-semibold tracking-tight"
          >
            <span className="hidden sm:inline">{formattedTimeDesktop || '00:00:00 WAT'}</span>
            <span className="sm:hidden">{formattedTimeMobile || '00:00 WAT'}</span>
          </div>

          {/* Weather Segment (Gracefully renders if available) */}
          {weather && (
            <>
              <span className="text-slate-400">·</span>
              <div
                className="flex items-center gap-1.5 text-slate-200"
                aria-label={accessibleWeatherText}
                title={accessibleWeatherText}
              >
                {WeatherIcon}
                <span className="font-semibold text-white">{weather.temperature}°C</span>
                <span className="text-slate-300 hidden md:inline">{weatherLabel}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default GlobalContextBar;
