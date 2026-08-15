import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import ImpactMapPage from '@/views/ImpactMapPage';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Nigeria National Impact Map | Tinubu Achievement Tracker',
  description:
    'Interactive geospatial visualization of capital projects, beneficiary distributions, and policy impacts across all 36 States and the Federal Capital Territory.',
  alternates: {
    canonical: 'https://tinubutracker.ng/impact-map',
  },
};

export default function MapPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ImpactMapPage />
    </Suspense>
  );
}