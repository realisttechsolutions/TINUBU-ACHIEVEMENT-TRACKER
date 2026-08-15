import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { dataAdapter } from '@/adapters/dataAdapter';
import PolicyDetail from '@/views/PolicyDetail';
import Loading from '../../loading';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const policies = dataAdapter.getPolicies();
  return policies.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const policy = dataAdapter.getPolicyBySlug(resolvedParams?.slug || '');
  if (!policy) {
    return {
      title: 'Policy Not Found | Tinubu Achievement Tracker',
      description: 'The requested statutory policy record could not be found.',
    };
  }

  return {
    title: `${policy.title} | Tinubu Achievement Tracker`,
    description: policy.summary,
    alternates: {
      canonical: `https://tinubutracker.ng/policies/${policy.slug}`,
    },
    openGraph: {
      title: policy.title,
      description: policy.summary,
      url: `https://tinubutracker.ng/policies/${policy.slug}`,
      siteName: 'Tinubu Achievement Tracker',
      locale: 'en_NG',
      type: 'article',
    },
  };
}

export default async function PolicyDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const policy = dataAdapter.getPolicyBySlug(resolvedParams?.slug || '');
  if (!policy) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <PolicyDetail />
    </Suspense>
  );
}