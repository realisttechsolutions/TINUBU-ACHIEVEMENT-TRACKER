import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import StatesCatalogue from '@/views/StatesCatalogue';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Subnational State Directory | Tinubu Achievement Tracker',
  description:
    'Explore federal capital investments, infrastructure delivery, and verified beneficiaries across each of Nigerias 36 States and the FCT.',
  alternates: {
    canonical: 'https://tinubutracker.ng/states',
  },
};

export default function StatesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <StatesCatalogue />
    </Suspense>
  );
}