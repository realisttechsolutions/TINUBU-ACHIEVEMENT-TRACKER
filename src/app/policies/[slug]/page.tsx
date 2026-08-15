import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { dataAdapter } from '@/adapters/dataAdapter';
import PolicyDetail from '@/views/PolicyDetail';
import Loading from '../../loading';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const policies = dataAdapter.getPolicies();
  return policies.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const policy = dataAdapter.getPolicyBySlug(params.slug);
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
    },
  };
}

export default function PolicyDetailPage({ params }: Props) {
  const policy = dataAdapter.getPolicyBySlug(params.slug);
  if (!policy) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <PolicyDetail />
    </Suspense>
  );
}