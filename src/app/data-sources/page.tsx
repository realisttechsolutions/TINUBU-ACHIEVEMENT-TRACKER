import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import DataSources from '@/views/DataSources';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Data Sources & Public Methodology | Tinubu Achievement Tracker',
  description:
    'Complete empirical research methodology, institutional source register, evidence verification standards, and editorial governance protocols governing the Tinubu Achievement Tracker.',
  alternates: {
    canonical: 'https://tinubutracker.ng/data-sources',
  },
};

export default function DataSourcesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DataSources />
    </Suspense>
  );
}