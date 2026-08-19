import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import SectorsCatalogue from '@/views/SectorsCatalogue';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Canonical Sector Directory | President Tinubu Achievement Tracker',
  description:
    'Explore national policies, infrastructure projects, and verified achievements organized across the 10 canonical governance sectors of the Federal Republic of Nigeria.',
  alternates: {
    canonical: 'https://tinubutracker.ng/sectors',
  },
};

export default function SectorsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SectorsCatalogue />
    </Suspense>
  );
}