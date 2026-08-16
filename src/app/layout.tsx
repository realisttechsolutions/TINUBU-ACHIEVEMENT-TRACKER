import type { Metadata, Viewport } from 'next';
import React from 'react';
import Providers from './providers';
import { getPublicDataSnapshot } from '@/server/data/public-snapshot';
import '@/index.css';

// Runtime rendering is required so App Hosting can hydrate the public adapter
// from Cloud SQL instead of freezing synthetic build-time data into HTML.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://tinubutracker.ng'),
  title: {
    default: 'Tinubu Achievement Tracker - Nigeria National Progress & Evidence Hub (2023 - 2026)',
    template: '%s | Tinubu Achievement Tracker',
  },
  description:
    "Official empirical tracker documenting President Bola Ahmed Tinubu's achievements, infrastructure projects, statutory policies, and economic reforms backed by primary institutional evidence.",
  keywords: [
    'Tinubu Achievement Tracker',
    'Nigeria Federal Government',
    'Bola Ahmed Tinubu',
    'Renewed Hope Agenda',
    'Economic Reforms',
    'Infrastructure Projects',
    'Nigeria Progress Dashboard',
    'National Development',
  ],
  authors: [{ name: 'Tinubu Achievement Tracker Research & Data Team' }],
  creator: 'Federal Republic of Nigeria Data Intelligence',
  publisher: 'Tinubu Achievement Tracker',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://tinubutracker.ng',
    siteName: 'Tinubu Achievement Tracker',
    title: 'Tinubu Achievement Tracker - Empirical Progress & Evidence Hub',
    description:
      "Comprehensive data-driven platform tracking President Bola Ahmed Tinubu's national achievements, infrastructure investments, and statutory policies.",
    images: [
      {
        url: '/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tinubu Achievement Tracker - National Progress Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tinubu Achievement Tracker - Empirical Progress & Evidence Hub',
    description:
      "Verified achievements, infrastructure delivery, and macroeconomic data under the administration of President Bola Ahmed Tinubu (2023 - 2026).",
    images: ['/assets/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/assets/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#081B2E' },
    { media: '(prefers-color-scheme: dark)', color: '#071522' },
  ],
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publicData = await getPublicDataSnapshot();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Providers publicData={publicData}>{children}</Providers>
      </body>
    </html>
  );
}
