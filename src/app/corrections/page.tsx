import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import DataSources from '@/views/DataSources';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Audited Corrections & Retractions Register | President Tinubu Achievement Tracker',
  description:
    'Public audit register of evidence corrections, data updates, methodological adjustments, and editorial rectifications.',
  alternates: {
    canonical: 'https://tinubutracker.ng/corrections',
  },
};

export default function CorrectionsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DataSources />
    </Suspense>
  );
}