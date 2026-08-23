import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Dashboard from '@/views/Dashboard';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'National Macro Intelligence Observatory | President Tinubu Achievement Tracker',
  description:
    'Authoritative macroeconomic observatory tracking real GDP growth, headline and food inflation, foreign exchange dynamics, sovereign debt composition, and policy transmission under President Bola Ahmed Tinubu.',
  keywords: [
    'Nigeria Macro Observatory',
    'Nigeria GDP Growth NBS',
    'Headline Inflation Nigeria',
    'CBN Exchange Rate NFEM',
    'External Reserves Nigeria',
    'Monetary Policy Rate MPR',
    'DMO Public Debt Profile',
    'FAAC Revenue Allocation',
    'Renewed Hope Economic Policy'
  ],
  alternates: {
    canonical: 'https://tinubutracker.ng/dashboard',
  },
  openGraph: {
    title: 'National Macro Intelligence Observatory — PTAT Nigeria',
    description:
      'Certified statutory macroeconomic data and longitudinal trend intelligence from NBS, CBN, DMO, and NUPRC.',
    url: 'https://tinubutracker.ng/dashboard',
    type: 'website',
  },
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}