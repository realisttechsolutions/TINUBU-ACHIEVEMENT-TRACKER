import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import DataSources from '@/views/DataSources';
import Loading from '../../loading';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Source Record ${params.slug} | Tinubu Achievement Tracker`,
    description: `Primary evidence and institutional publication details for source record ${params.slug}.`,
    alternates: {
      canonical: `https://tinubutracker.ng/sources/${params.slug}`,
    },
  };
}

export default function SourceDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <DataSources />
    </Suspense>
  );
}