import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { AchievementsCatalogue } from '@/views/AchievementsCatalogue';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'National Achievements Catalogue | Tinubu Achievement Tracker',
  description:
    'Comprehensive verified catalogue of achievements, capital projects, statutory policies, and social interventions under President Bola Ahmed Tinubu.',
  alternates: {
    canonical: 'https://tinubutracker.ng/achievements',
  },
};

export default function AchievementsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AchievementsCatalogue />
    </Suspense>
  );
}
