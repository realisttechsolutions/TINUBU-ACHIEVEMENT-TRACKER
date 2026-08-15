import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { dataAdapter } from '@/adapters/dataAdapter';
import StateDetail from '@/views/StateDetail';
import Loading from '../../loading';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const states = dataAdapter.getStates();
  return states.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const state = dataAdapter.getStateBySlug(resolvedParams?.slug || '');
  if (!state) {
    return {
      title: 'State Not Found | Tinubu Achievement Tracker',
      description: 'The requested state profile could not be found.',
    };
  }

  return {
    title: `${state.name} State Impact & Projects | Tinubu Achievement Tracker`,
    description: `Federal capital investments, infrastructure delivery, and verified outcomes in ${state.name} State (${state.geopoliticalZone}).`,
    alternates: {
      canonical: `https://tinubutracker.ng/states/${state.slug}`,
    },
    openGraph: {
      title: `${state.name} State - Federal Achievements & Delivery`,
      description: `Federal capital investments and verified outcomes across ${state.capital} and ${state.name} State.`,
      url: `https://tinubutracker.ng/states/${state.slug}`,
      siteName: 'Tinubu Achievement Tracker',
      locale: 'en_NG',
      type: 'website',
    },
  };
}

export default async function StateDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const state = dataAdapter.getStateBySlug(resolvedParams?.slug || '');
  if (!state) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <StateDetail />
    </Suspense>
  );
}