import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import DataSources from '@/views/DataSources';
import Loading from '../../loading';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  return {
    title: `Source Record ${slug} | President Tinubu Achievement Tracker`,
    description: `Primary evidence and institutional publication details for source record ${slug}.`,
    alternates: {
      canonical: `https://tinubutracker.ng/sources/${slug}`,
    },
  };
}

export default async function SourceDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <DataSources />
    </Suspense>
  );
}