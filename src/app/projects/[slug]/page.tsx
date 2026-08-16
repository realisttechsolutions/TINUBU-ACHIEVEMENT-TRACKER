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
  const project = (await getPublicDataSnapshot())?.projects.find((record) => record.slug === slug)
    ?? dataAdapter.getProjectBySlug(slug);
  return project ? { title: `${project.title} | Tinubu Achievement Tracker`, description: project.summary } : { title: 'Project Not Found | Tinubu Achievement Tracker' };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = (await getPublicDataSnapshot())?.projects.find((record) => record.slug === slug)
    ?? dataAdapter.getProjectBySlug(slug);
  if (!project) notFound();
  return <Suspense fallback={<Loading />}><PublicRecordDetail kind="project" /></Suspense>;
}
