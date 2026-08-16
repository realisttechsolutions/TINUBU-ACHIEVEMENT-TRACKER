import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { dataAdapter } from '@/adapters/dataAdapter';
import PublicRecordDetail from '@/components/records/PublicRecordDetail';
import Loading from '../../loading';
import { getPublicDataSnapshot } from '@/server/data/public-snapshot';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme = (await getPublicDataSnapshot())?.programmes.find((record) => record.slug === slug)
    ?? dataAdapter.getProgrammeBySlug(slug);
  return programme ? { title: `${programme.title} | Tinubu Achievement Tracker`, description: programme.summary } : { title: 'Programme Not Found | Tinubu Achievement Tracker' };
}

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const programme = (await getPublicDataSnapshot())?.programmes.find((record) => record.slug === slug)
    ?? dataAdapter.getProgrammeBySlug(slug);
  if (!programme) notFound();
  return <Suspense fallback={<Loading />}><PublicRecordDetail kind="programme" /></Suspense>;
}
