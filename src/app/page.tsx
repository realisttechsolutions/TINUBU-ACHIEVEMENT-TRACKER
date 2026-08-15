import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Index from '@/views/Index';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Tinubu Achievement Tracker | Official Evidence-Backed Records (2023–2026)',
  description:
    'Comprehensive, independently audited tracking portal documenting policy reforms, infrastructure projects, macroeconomic stabilization, and institutional milestones of President Bola Ahmed Tinubu GCFR.',
  alternates: {
    canonical: 'https://tinubutracker.ng',
  },
};

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <Index />
    </Suspense>
  );
}