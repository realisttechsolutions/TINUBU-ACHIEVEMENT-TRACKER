import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Dashboard from '@/views/Dashboard';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Executive Impact Dashboard | President Tinubu Achievement Tracker',
  description:
    'Real-time data visualization, key performance indicators, fiscal metrics, and delivery statistics across all sectors.',
  alternates: {
    canonical: 'https://tinubutracker.ng/dashboard',
  },
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}