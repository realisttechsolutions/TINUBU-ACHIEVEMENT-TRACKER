import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Downloads from '@/views/Downloads';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Reports & Open Data Downloads Centre | Tinubu Achievement Tracker',
  description:
    'Download public policy briefs, sectoral delivery reports, open research datasets (CSV/JSON), and official presidential achievement compendiums.',
  alternates: {
    canonical: 'https://tinubutracker.ng/downloads',
  },
};

export default function DownloadsRoutePage() {
  return (
    <Suspense fallback={<Loading />}>
      <Downloads />
    </Suspense>
  );
}