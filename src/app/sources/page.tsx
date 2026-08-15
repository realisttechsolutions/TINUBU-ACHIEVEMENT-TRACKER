import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import DataSources from '@/views/DataSources';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Primary Institutional Source Directory | Tinubu Achievement Tracker',
  description:
    'Primary sources, gazettes, ministerial reports, central bank statistical bulletins, and multilateral datasets supporting verified claims on the tracker.',
  alternates: {
    canonical: 'https://tinubutracker.ng/sources',
  },
};

export default function SourcesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DataSources />
    </Suspense>
  );
}