import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import TimelinePage from '@/views/TimelinePage';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'National Policy & Reform Timeline | Tinubu Achievement Tracker',
  description:
    'Chronological evidence timeline tracking statutory presidential assents, macroeconomic policy circulars, project groundbreakings, and commissioning milestones (2023 - 2026).',
  alternates: {
    canonical: 'https://tinubutracker.ng/timeline',
  },
};

export default function TimelineRoutePage() {
  return (
    <Suspense fallback={<Loading />}>
      <TimelinePage />
    </Suspense>
  );
}