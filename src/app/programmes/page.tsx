import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import ProgrammesCatalogue from '@/views/ProgrammesCatalogue';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'National Social & Economic Programmes | Tinubu Achievement Tracker',
  description:
    'Direct intervention programmes, credit facilities, student loans, digital skill fellowships, and social protection initiatives of the Federal Government of Nigeria.',
  alternates: {
    canonical: 'https://tinubutracker.ng/programmes',
  },
};

export default function ProgrammesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProgrammesCatalogue />
    </Suspense>
  );
}