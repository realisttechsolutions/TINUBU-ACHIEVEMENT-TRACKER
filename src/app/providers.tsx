'use client';

import React, { useState, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import AppShell from '@/components/layout/AppShell';
import Loading from './loading';

// Import i18n instance on client
import '@/i18n/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <LanguageProvider>
          <TooltipProvider>
            <ErrorBoundary>
              <div className="scroll-smooth min-h-screen flex flex-col">
                <Toaster />
                <Sonner />
                <AppShell>
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                </AppShell>
              </div>
            </ErrorBoundary>
          </TooltipProvider>
        </LanguageProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

export default Providers;