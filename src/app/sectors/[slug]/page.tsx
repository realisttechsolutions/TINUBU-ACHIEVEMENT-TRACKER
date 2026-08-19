import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { dataAdapter } from '@/adapters/dataAdapter';
import SectorDetail from '@/views/SectorDetail';
import Loading from '../../loading';
import { getPublicDataSnapshot } from '@/server/data/public-snapshot';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sectors = (await getPublicDataSnapshot())?.sectors ?? dataAdapter.getSectors();
  return sectors.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const sector = (await getPublicDataSnapshot())?.sectors.find((record) => record.slug === slug)
    ?? dataAdapter.getSectorBySlug(slug);
  if (!sector) {
    return {
      title: 'Sector Not Found | President Tinubu Achievement Tracker',
      description: 'The requested sector could not be found.',
    };
  }

  return {
    title: `${sector.name} Sector | President Tinubu Achievement Tracker`,
    description: sector.description,
    alternates: {
      canonical: `https://tinubutracker.ng/sectors/${sector.slug}`,
    },
    openGraph: {
      title: `${sector.name} Sector Progress & Evidence`,
      description: sector.description,
      url: `https://tinubutracker.ng/sectors/${sector.slug}`,
      siteName: 'President Tinubu Achievement Tracker',
      locale: 'en_NG',
      type: 'website',
    },
  };
}

export default async function SectorDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const sector = (await getPublicDataSnapshot())?.sectors.find((record) => record.slug === slug)
    ?? dataAdapter.getSectorBySlug(slug);
  if (!sector) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <SectorDetail />
    </Suspense>
  );
}
