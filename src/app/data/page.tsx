import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import DataExplorer from '@/views/DataExplorer';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Interactive Data Explorer | Tinubu Achievement Tracker',
  description:
    'Multi-dimensional evidence query tool allowing public search, filtering, and cross-tabulation across sectors, states, institutions, and funding envelopes.',
  alternates: {
    canonical: 'https://tinubutracker.ng/data',
  },
};

export default function DataPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DataExplorer />
    </Suspense>
  );
}