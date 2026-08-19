import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import PoliciesCatalogue from '@/views/PoliciesCatalogue';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Statutory Policies & Executive Orders | President Tinubu Achievement Tracker',
  description:
    'Authoritative registry of Acts of the National Assembly, Presidential Executive Orders, and statutory regulatory instruments enacted under President Bola Ahmed Tinubu.',
  alternates: {
    canonical: 'https://tinubutracker.ng/policies',
  },
};

export default function PoliciesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PoliciesCatalogue />
    </Suspense>
  );
}